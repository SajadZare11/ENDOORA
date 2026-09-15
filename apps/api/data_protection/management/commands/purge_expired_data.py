from __future__ import annotations
import json
from django.core.management.base import BaseCommand
from data_protection.services.retention_service import run_retention_purge

class Command(BaseCommand):
    help = "Purges expired PII, recordings, OTPs, and executes scheduled deletions."

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Run in simulation mode without committing database deletions',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        self.stdout.write(f"Starting purge. Dry run: {dry_run}")
        
        result = run_retention_purge(dry_run=dry_run, trigger="manual_operator")
        
        self.stdout.write(self.style.SUCCESS("Purge completed! Summary:"))
        self.stdout.write(json.dumps(result, indent=2))
