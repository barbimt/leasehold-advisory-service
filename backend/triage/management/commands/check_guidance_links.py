from django.core.management.base import BaseCommand, CommandError

from triage.guidance_link_check import check_guidance_url
from triage.topics import curated_guidance_urls

FAILED_STATUSES = frozenset({"broken", "unreachable"})


class Command(BaseCommand):
    help = (
        "Check curated LEASE guidance URLs. Optional maintenance only; not used in CI."
    )

    def handle(self, *args, **options):
        failed = 0
        for url in curated_guidance_urls():
            result = check_guidance_url(url)
            line = f"{result.status.upper()}\t{result.url}\t{result.detail}"
            if result.status in FAILED_STATUSES:
                failed += 1
                self.stderr.write(self.style.ERROR(line))
            elif result.status in {"redirect", "blocked"}:
                self.stdout.write(self.style.WARNING(line))
            else:
                self.stdout.write(self.style.SUCCESS(line))

        if failed:
            raise CommandError(
                f"{failed} guidance link(s) are broken or unreachable.",
            )
