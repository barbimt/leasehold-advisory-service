from dataclasses import dataclass
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

TIMEOUT_SECONDS = 10
USER_AGENT = "LeaseholdAdvisoryServiceLinkCheck/1.0"


@dataclass(frozen=True)
class LinkCheckResult:
    url: str
    status: str
    detail: str


def check_guidance_url(url: str) -> LinkCheckResult:
    request = Request(
        url,
        headers={"User-Agent": USER_AGENT},
        method="GET",
    )
    try:
        with urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            final_url = response.geturl()
            code = getattr(response, "status", None) or response.getcode()
            if final_url != url:
                return LinkCheckResult(
                    url,
                    "redirect",
                    f"HTTP {code} to {final_url}",
                )
            return LinkCheckResult(url, "ok", f"HTTP {code}")
    except HTTPError as error:
        if error.code in {401, 403}:
            return LinkCheckResult(url, "blocked", f"HTTP {error.code}")
        return LinkCheckResult(url, "broken", f"HTTP {error.code}")
    except (TimeoutError, URLError, OSError) as error:
        reason = getattr(error, "reason", error)
        return LinkCheckResult(url, "unreachable", str(reason))
