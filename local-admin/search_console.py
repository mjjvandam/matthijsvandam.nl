"""Local, dated Search Console observations; no background account access."""
import json
from datetime import datetime, timezone

URL = "https://search.google.com/search-console?resource_id=sc-domain%3Amatthijsvandam.nl"

def read_search_console(state_dir):
    result = {"status": "Niet opgehaald", "dashboard_url": URL}
    try:
        raw = json.loads((state_dir / "search-console.json").read_text())
        captured = datetime.fromisoformat(raw["captured_at"])
        if captured.tzinfo is None or captured > datetime.now(timezone.utc):
            raise ValueError("Invalid timestamp")
        datetime.strptime(raw["index_updated_at"], "%Y-%m-%d")
        for key in ("discovered", "indexed", "not_indexed", "not_found", "redirected", "canonical_alternate"):
            if type(raw[key]) is not int or raw[key] < 0:
                raise ValueError("Invalid metric")
        # Optional reasons preserve compatibility with the earlier three-reason snapshot.
        extra = {key: raw[key] for key in ("discovered_not_indexed", "crawled_not_indexed") if key in raw}
        if any(type(value) is not int or value < 0 for value in extra.values()):
            raise ValueError("Invalid exclusion metric")
        if raw["not_indexed"] != raw["not_found"] + raw["redirected"] + raw["canonical_alternate"] + sum(extra.values()):
            raise ValueError("Inconsistent totals")
        if raw["verified"] is not True or raw["sitemap_status"] not in {"Sitemap is verwerkt", "Succesvol"}:
            raise ValueError("Unknown verification or sitemap status")
        result.update({key: raw[key] for key in ("captured_at", "index_updated_at", "verified", "sitemap_status", "discovered", "indexed", "not_indexed", "not_found", "redirected", "canonical_alternate")})
        result.update(extra)
        result["status"] = "Opgeslagen momentopname"
        result["stale"] = (datetime.now(timezone.utc) - captured).days >= 7
    except (OSError, ValueError, KeyError, TypeError, AttributeError):
        pass
    return result
