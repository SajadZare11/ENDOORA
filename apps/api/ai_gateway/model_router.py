"""
Endoora AI Gateway - Model Router
Implements task-specific multi-tier routing across OpenRouter models.
Eliminates hardcoding of single free models by defining primary and progressive fallback tiers.
"""

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class ModelTier:
    model_id: str
    tier_level: int
    context_window: int
    supports_json: bool
    is_free: bool
    description: str


TASK_ROUTING_TABLE: dict[str, list[ModelTier]] = {
    "exercise_generation": [
        ModelTier(
            model_id="google/gemma-2-9b-it:free",
            tier_level=1,
            context_window=8192,
            supports_json=True,
            is_free=True,
            description="Primary lightweight free tier for pedagogical exercise generation",
        ),
        ModelTier(
            model_id="meta-llama/llama-3.1-8b-instruct:free",
            tier_level=2,
            context_window=8192,
            supports_json=True,
            is_free=True,
            description="Secondary free fallback tier with robust instruction adherence",
        ),
        ModelTier(
            model_id="mistralai/mistral-7b-instruct",
            tier_level=3,
            context_window=8192,
            supports_json=True,
            is_free=False,
            description="Tertiary high-availability paid fallback (low cost per token)",
        ),
        ModelTier(
            model_id="qwen/qwen-2.5-7b-instruct",
            tier_level=4,
            context_window=32768,
            supports_json=True,
            is_free=False,
            description="Quaternary fallback with deep multilingual capabilities",
        ),
    ],
    "writing_diagnostics": [
        ModelTier(
            model_id="meta-llama/llama-3.1-8b-instruct:free",
            tier_level=1,
            context_window=8192,
            supports_json=True,
            is_free=True,
            description="Primary diagnostics model",
        ),
        ModelTier(
            model_id="mistralai/mistral-7b-instruct",
            tier_level=2,
            context_window=8192,
            supports_json=True,
            is_free=False,
            description="Fallback diagnostics model",
        ),
    ],
}


class ModelRouter:
    """Manages task routing and fallback sequences without vendor lock-in."""

    @classmethod
    def get_tier_sequence(cls, task_name: str = "exercise_generation") -> list[ModelTier]:
        return TASK_ROUTING_TABLE.get(
            task_name, TASK_ROUTING_TABLE["exercise_generation"]
        )

    @classmethod
    def get_models_for_task(cls, task_name: str = "exercise_generation") -> list[str]:
        tiers = cls.get_tier_sequence(task_name)
        return [tier.model_id for tier in tiers]

    @classmethod
    def get_model_info(cls, model_id: str) -> dict[str, Any] | None:
        for tiers in TASK_ROUTING_TABLE.values():
            for t in tiers:
                if t.model_id == model_id:
                    return {
                        "model_id": t.model_id,
                        "tier_level": t.tier_level,
                        "context_window": t.context_window,
                        "supports_json": t.supports_json,
                        "is_free": t.is_free,
                        "description": t.description,
                    }
        return None
