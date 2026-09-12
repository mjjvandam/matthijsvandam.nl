"""Read a dated, aggregate-only snapshot from the existing Vercel dashboard.

No credentials, tracking changes, background jobs, or invented metrics. A browser
session is not an API credential. Refresh with an explicit, verified new snapshot.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

DASHBOARD_URL = "https://vercel.com/mjjvandam-8924s-projects/matthijsvandam-nl/analytics"


def read_analytics(repo_root: Path, state_dir: Path) -> dict:
    result = {
        "status": "Niet opgehaald",
        "message": "Open de bestaande Vercel-statistieken voor de actuele aantallen.",
        "dashboard_url": DASHBOARD_URL,
        "pages": [],
    }
    try:
        raw = json.loads((state_dir / "analytics.json").read_text(encoding="utf-8"))
        captured = datetime.fromisoformat(raw["captured_at"].replace("Z", "+00:00"))
        if captured.tzinfo is None or captured > datetime.now(timezone.utc):
            raise ValueError("Invalid observation timestamp")
        for field in ("views", "visitors"):
            if type(raw[field]) is not int or raw[field] < 0:
                raise ValueError("Invalid metric")
        if raw["environment"] != "Production" or len(raw["period"]) > 150:
            raise ValueError("Unknown reporting scope")
        registered = json.loads(
            (repo_root / "PUBLICATIE_REGISTER.json").read_text(encoding="utf-8")
        )["pages"]
        titles = {"/" + item["path"]: item.get("title", item["path"]).split(" | ")[0].strip()
                  for item in registered}
        titles["/"] = "Homepage"
        if "/index.html" in titles:
            # These are separate provider rows, not deduplicated people.
            titles["/index.html"] = "Homepage (via /index.html)"
        pages = []
        seen = set()
        for item in raw.get("pages", [])[:50]:
            if item.get("path") not in titles:
                continue
            if type(item.get("visitors")) is not int or item["visitors"] < 0:
                raise ValueError("Invalid page metric")
            if item["path"] in seen:
                raise ValueError("Duplicate page metric")
            seen.add(item["path"])
            pages.append({"path": item["path"], "title": titles[item["path"]], "visitors": item["visitors"]})
        # Preserve the provider's order for tied values; never sum URL aliases.
        pages.sort(key=lambda item: -item["visitors"])
        period_label = raw.get("period_label")
        if period_label is not None and (not isinstance(period_label, str) or not period_label.strip() or len(period_label) > 100):
            raise ValueError("Invalid period label")
        result.update({
            "status": "Momentopname",
            "message": "Overgenomen uit Vercel op " + captured.astimezone().strftime("%d-%m-%Y om %H:%M")
                + ". Deze opgeslagen cijfers verversen niet automatisch. De ranglijst toont de beschikbare toppagina's op aantal bezoekers.",
            "captured_at": captured.isoformat(),
            "period": raw["period"],
            "period_label": period_label or raw["period"],
            "environment": "Production",
            "views": raw["views"],
            "visitors": raw["visitors"],
            "pages": pages,
        })
    except (OSError, ValueError, KeyError, TypeError, AttributeError):
        pass
    return result
