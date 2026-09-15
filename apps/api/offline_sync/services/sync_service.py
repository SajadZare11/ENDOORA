from __future__ import annotations

import json
import logging
import uuid
from typing import Any, Dict, List, Optional

from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from django.utils.dateparse import parse_datetime

from security.validators import sanitize_text_input
from ..models import DraftType, OfflineDraft, OfflineSyncTelemetry

logger = logging.getLogger(__name__)
User = get_user_model()


class SyncService:
    """Enterprise offline drafts synchronization and conflict resolution service."""

    @classmethod
    def sanitize_draft_payload(cls, content: Any) -> Any:
        """Recursively sanitize string contents in draft JSON payload."""
        if isinstance(content, str):
            return sanitize_text_input(content)
        elif isinstance(content, dict):
            return {k: cls.sanitize_draft_payload(v) for k, v in content.items()}
        elif isinstance(content, list):
            return [cls.sanitize_draft_payload(item) for item in content]
        return content

    @classmethod
    @transaction.atomic
    def process_batch_sync(
        cls,
        user: Any,
        drafts_payload: List[Dict[str, Any]],
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Process incoming batch of drafts from client offline sync queue.
        Enforces optimistic concurrency, detects conflicts, and logs telemetry.
        """
        metadata = metadata or {}
        sync_session_id = metadata.get("sync_session_id") or str(uuid.uuid4())
        network_type = metadata.get("network_effective_type", "unknown")
        is_low_bandwidth = bool(metadata.get("is_low_bandwidth", False))
        user_agent = metadata.get("client_user_agent", "")
        payload_bytes = int(metadata.get("payload_bytes", 0))

        synced_results = []
        conflicts_count = 0
        updated_count = 0

        for item in drafts_payload:
            draft_id_str = item.get("id")
            draft_type = item.get("draft_type", DraftType.GENERAL_DRAFT)
            resource_id = item.get("resource_id", "")
            title = sanitize_text_input(item.get("title") or "پیش‌نویس بدون عنوان")
            raw_content = item.get("content_json") or {}
            content = cls.sanitize_draft_payload(raw_content)
            client_version = int(item.get("client_version", 1))
            client_updated_at_raw = item.get("client_updated_at")
            client_updated_at = (
                parse_datetime(client_updated_at_raw)
                if client_updated_at_raw
                else timezone.now()
            ) or timezone.now()

            checksum = OfflineDraft.compute_content_checksum(content)

            existing_draft: Optional[OfflineDraft] = None
            if draft_id_str:
                try:
                    existing_draft = OfflineDraft.objects.filter(
                        id=draft_id_str, user=user
                    ).first()
                except Exception:
                    existing_draft = None

            if not existing_draft and resource_id:
                existing_draft = OfflineDraft.objects.filter(
                    user=user,
                    draft_type=draft_type,
                    resource_id=resource_id,
                    is_archived=False,
                ).first()

            if not existing_draft:
                # Create brand new draft
                new_draft = OfflineDraft(
                    id=uuid.UUID(draft_id_str) if draft_id_str else uuid.uuid4(),
                    user=user,
                    draft_type=draft_type,
                    resource_id=resource_id,
                    title=title,
                    content_json=content,
                    client_version=client_version,
                    server_version=1,
                    client_updated_at=client_updated_at,
                    checksum=checksum,
                    is_conflict=False,
                    is_archived=False,
                )
                new_draft.save()
                updated_count += 1
                synced_results.append(new_draft)
            else:
                # Existing draft: inspect version for conflict
                if client_version < existing_draft.server_version and existing_draft.checksum != checksum:
                    # Concurrency conflict detected!
                    existing_draft.is_conflict = True
                    existing_draft.conflict_backup = {
                        "title": title,
                        "content_json": content,
                        "client_version": client_version,
                        "client_updated_at": client_updated_at.isoformat(),
                        "checksum": checksum,
                    }
                    existing_draft.save(
                        update_fields=["is_conflict", "conflict_backup", "server_updated_at"]
                    )
                    conflicts_count += 1
                    synced_results.append(existing_draft)
                else:
                    # Happy path update: increment server version
                    existing_draft.title = title
                    existing_draft.content_json = content
                    existing_draft.client_version = client_version
                    existing_draft.server_version += 1
                    existing_draft.client_updated_at = client_updated_at
                    existing_draft.checksum = checksum
                    existing_draft.is_conflict = False
                    existing_draft.conflict_backup = {}
                    existing_draft.save()
                    updated_count += 1
                    synced_results.append(existing_draft)

        # Record telemetry
        telemetry = OfflineSyncTelemetry.objects.create(
            user=user if getattr(user, "is_authenticated", False) else None,
            sync_session_id=sync_session_id,
            drafts_received=len(drafts_payload),
            drafts_updated=updated_count,
            conflicts_detected=conflicts_count,
            payload_bytes=payload_bytes,
            network_effective_type=network_type,
            is_low_bandwidth=is_low_bandwidth,
            client_user_agent=user_agent[:255],
        )

        return {
            "sync_session_id": sync_session_id,
            "drafts_received": len(drafts_payload),
            "drafts_updated": updated_count,
            "conflicts_detected": conflicts_count,
            "server_timestamp": timezone.now().isoformat(),
            "telemetry_id": str(telemetry.id),
            "drafts": synced_results,
        }

    @classmethod
    @transaction.atomic
    def resolve_draft_conflict(
        cls,
        user: Any,
        draft_id: uuid.UUID | str,
        resolution: str,
        chosen_content: Optional[Dict[str, Any]] = None,
    ) -> OfflineDraft:
        """
        Resolves a draft conflict explicitly.
        Resolution strategies:
          - 'keep_server': Preserves server content, clears conflict and backup.
          - 'keep_client': Overwrites server content with client backup revision.
          - 'custom_merge': Replaces content with specified merged JSON.
        """
        draft = OfflineDraft.objects.get(id=draft_id, user=user)

        if not draft.is_conflict:
            return draft

        if resolution == "keep_server":
            draft.is_conflict = False
            draft.conflict_backup = {}
            draft.server_version += 1
            draft.save()
        elif resolution == "keep_client":
            backup = draft.conflict_backup or {}
            client_content = backup.get("content_json") or {}
            draft.content_json = client_content
            draft.checksum = OfflineDraft.compute_content_checksum(client_content)
            draft.is_conflict = False
            draft.conflict_backup = {}
            draft.server_version += 1
            draft.save()
        elif resolution == "custom_merge":
            merged = cls.sanitize_draft_payload(chosen_content or {})
            draft.content_json = merged
            draft.checksum = OfflineDraft.compute_content_checksum(merged)
            draft.is_conflict = False
            draft.conflict_backup = {}
            draft.server_version += 1
            draft.save()
        else:
            raise ValueError(f"Unknown conflict resolution strategy: {resolution}")

        return draft
