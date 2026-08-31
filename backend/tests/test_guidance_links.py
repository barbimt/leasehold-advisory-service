from unittest.mock import MagicMock, patch
from urllib.error import HTTPError, URLError

from triage.guidance_link_check import check_guidance_url
from triage.topics import curated_guidance_urls


def test_curated_guidance_urls_are_unique_official_lease_pages() -> None:
    urls = curated_guidance_urls()

    assert urls
    assert len(urls) == len(set(urls))
    assert all(url.startswith("https://www.lease-advice.org/") for url in urls)


def _response(*, url: str, status: int = 200) -> MagicMock:
    response = MagicMock()
    response.geturl.return_value = url
    response.status = status
    response.getcode.return_value = status
    response.__enter__.return_value = response
    response.__exit__.return_value = False
    return response


@patch("triage.guidance_link_check.urlopen")
def test_check_guidance_url_ok(urlopen: MagicMock) -> None:
    url = "https://www.lease-advice.org/example/"
    urlopen.return_value = _response(url=url)

    result = check_guidance_url(url)

    assert result.status == "ok"
    assert "200" in result.detail


@patch("triage.guidance_link_check.urlopen")
def test_check_guidance_url_redirect(urlopen: MagicMock) -> None:
    url = "https://www.lease-advice.org/old/"
    urlopen.return_value = _response(
        url="https://www.lease-advice.org/new/",
        status=200,
    )

    result = check_guidance_url(url)

    assert result.status == "redirect"
    assert "https://www.lease-advice.org/new/" in result.detail


@patch("triage.guidance_link_check.urlopen")
def test_check_guidance_url_blocked(urlopen: MagicMock) -> None:
    url = "https://www.lease-advice.org/example/"
    urlopen.side_effect = HTTPError(url, 403, "Forbidden", hdrs=None, fp=None)

    result = check_guidance_url(url)

    assert result.status == "blocked"
    assert "403" in result.detail


@patch("triage.guidance_link_check.urlopen")
def test_check_guidance_url_broken(urlopen: MagicMock) -> None:
    url = "https://www.lease-advice.org/missing/"
    urlopen.side_effect = HTTPError(url, 404, "Not Found", hdrs=None, fp=None)

    result = check_guidance_url(url)

    assert result.status == "broken"
    assert "404" in result.detail


@patch("triage.guidance_link_check.urlopen")
def test_check_guidance_url_unreachable(urlopen: MagicMock) -> None:
    urlopen.side_effect = URLError("timed out")

    result = check_guidance_url("https://www.lease-advice.org/example/")

    assert result.status == "unreachable"
    assert "timed out" in result.detail
