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
        performance = raw.get("performance")
        if isinstance(performance, dict):
            checked = datetime.fromisoformat(performance["captured_at"].replace("Z", "+00:00"))
            if checked.tzinfo is None or checked > datetime.now(timezone.utc):
                raise ValueError("Invalid performance timestamp")
            summary = performance.get("summary")
            if not isinstance(summary, dict):
                raise ValueError("Invalid performance summary")
            metrics = ("clicks", "impressions")
            if any(type(summary.get(key)) is not int or summary[key] < 0 for key in metrics):
                raise ValueError("Invalid performance metric")
            pages = performance.get("top_pages", [])
            if not isinstance(pages, list) or len(pages) > 50:
                raise ValueError("Invalid performance pages")
            clean_pages = []
            for page in pages:
                path = page.get("path") if isinstance(page, dict) else None
                if (not isinstance(path, str) or not path.startswith("/")
                        or path.startswith("//") or len(path) > 250
                        or any(type(page.get(key)) is not int or page[key] < 0
                               for key in metrics)):
                    raise ValueError("Invalid performance page")
                clean_pages.append({"path": path, **{key: page[key] for key in metrics}})
            attention = performance.get("attention")
            if attention is not None:
                if not isinstance(attention, dict) or not isinstance(attention.get("path"), str):
                    raise ValueError("Invalid performance attention")
                for key in ("impressions", "previous_impressions", "clicks"):
                    if type(attention.get(key)) is not int or attention[key] < 0:
                        raise ValueError("Invalid performance attention metric")
                if not 0 <= attention["ctr"] <= 100 or not 0 <= attention["position"]:
                    raise ValueError("Invalid performance attention percentage")
            result["performance"] = {
                "captured_at": checked.isoformat(),
                "period": str(performance.get("period", ""))[:100],
                "comparison_period": str(performance.get("comparison_period", ""))[:100],
                "summary": {key: summary[key] for key in metrics},
                "top_pages": clean_pages,
                "attention": attention,
            }
    except (OSError, ValueError, KeyError, TypeError, AttributeError):
        pass
    return result
