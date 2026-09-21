"""Fetch aggregate Web Analytics data from Vercel into the private local snapshot."""
from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

API_ROOT = "https://api.vercel.com/v1/query/web-analytics/visits"


class AnalyticsRefreshError(Exception):
    pass


def _config():
    token = os.environ.get("MVD_VERCEL_ANALYTICS_TOKEN")
    project_id = os.environ.get("MVD_VERCEL_PROJECT_ID")
    team_id = os.environ.get("MVD_VERCEL_TEAM_ID")
    missing = [name for name, value in (("MVD_VERCEL_ANALYTICS_TOKEN", token),
                                         ("MVD_VERCEL_PROJECT_ID", project_id),
                                         ("MVD_VERCEL_TEAM_ID", team_id)) if not value]
    if missing:
        raise AnalyticsRefreshError("Vercel-koppeling is nog niet ingesteld: " + ", ".join(missing))
    return token, project_id, team_id


def _query(path, token, project_id, team_id, params):
    query = {"projectId": project_id, "teamId": team_id, **params}
    request = Request(f"{API_ROOT}/{path}?{urlencode(query)}",
                      headers={"Authorization": f"Bearer {token}", "Accept": "application/json"})
    try:
        with urlopen(request, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as exc:
        raise AnalyticsRefreshError("Vercel Analytics kon niet worden opgehaald.") from exc


def _value(payload):
    if isinstance(payload, dict):
        for key in ("count", "value", "total"):
            if type(payload.get(key)) in (int, float):
                return int(payload[key])
        for key in ("data", "result"):
            if key in payload:
                value = _value(payload[key])
                if value is not None:
                    return value
    return None


def refresh_snapshot(repo_root: Path, state_dir: Path) -> dict:
    token, project_id, team_id = _config()
    until = datetime.now(timezone.utc)
    since = until - timedelta(days=30)
    params = {"from": since.strftime("%Y-%m-%d"), "to": until.strftime("%Y-%m-%d")}
    visitors = _query("count", token, project_id, team_id, {**params, "filter": "eventType eq 'visitor'"})
    views = _query("count", token, project_id, team_id, {**params, "filter": "eventType eq 'pageview'"})
    visitors_value, views_value = _value(visitors), _value(views)
    if visitors_value is None or views_value is None:
        raise AnalyticsRefreshError("Vercel gaf geen herkenbare bezoekers- of paginaweergavecijfers terug.")
    captured = datetime.now(timezone.utc).isoformat(timespec="seconds")
    snapshot = {"captured_at": captured, "views": views_value, "visitors": visitors_value,
                "environment": "Production", "period": "Laatste 30 dagen",
                "period_label": f"{since.astimezone().strftime('%-d %B %Y')} – {until.astimezone().strftime('%-d %B %Y')}",
                "pages": []}
    destination = state_dir / "analytics.json"
    destination.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    destination.chmod(0o600)
    return snapshot
