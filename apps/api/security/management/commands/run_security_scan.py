from __future__ import annotations
import json
from django.core.management.base import BaseCommand
from security.services.pen_test_runner import PenTestRunner

class Command(BaseCommand):
    help = "Run automated backend security penetration test and vulnerability scan (SEC-003)."

    def add_arguments(self, parser):
        parser.add_argument('--json', action='store_true', help='Output report as JSON')
        parser.add_argument('--verbose', action='store_true', help='Print verbose probe evidence')

    def handle(self, *args, **options):
        runner = PenTestRunner()
        report = runner.run_full_scan()

        if options['json']:
            self.stdout.write(json.dumps(report, indent=4))
            return

        self.stdout.write("=" * 80)
        self.stdout.write(" ENDOORA SECURITY PENETRATION TEST REPORT (SEC-003)")
        self.stdout.write("=" * 80)
        self.stdout.write(f" Scan ID:      {report['scan_id']}")
        self.stdout.write(f" Timestamp:    {report['scanned_at']}")
        self.stdout.write(f" Duration:     {report['duration_ms']} ms")
        self.stdout.write("-" * 80)
        
        for probe in report['probes']:
            status_color = self.style.SUCCESS('PASS') if probe['status'] == 'PASS' else self.style.ERROR('FAIL')
            self.stdout.write(f" [{status_color}] {probe['id']} - {probe['name']} (Severity: {probe['severity']})")
            if options['verbose'] or probe['status'] == 'FAIL':
                self.stdout.write(f"        Details: {probe['details']}")

        self.stdout.write("-" * 80)
        self.stdout.write(f" Total Probes: {report['total_probes']}")
        self.stdout.write(f" Passed:       {report['passed_count']}")
        self.stdout.write(f" Failed:       {report['failed_count']}")
        self.stdout.write(f" Score:        {report['score']}/100")
        
        if report['score'] == 100:
            self.stdout.write(self.style.SUCCESS(f"\n >>> STATUS: {report['certification']} <<<"))
        else:
            self.stdout.write(self.style.ERROR(f"\n >>> STATUS: {report['certification']} <<<"))
