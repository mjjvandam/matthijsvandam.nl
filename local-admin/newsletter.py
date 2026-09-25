"""Aggregate Brevo observations; never expose subscriber names or addresses."""
import json
from datetime import datetime, timezone


def read_newsletter(state_dir):
    result = {"status": "Niet opgehaald", "dashboard_url": "https://app.brevo.com/contact/list"}
    try:
        raw = json.loads((state_dir / "newsletter.json").read_text(encoding="utf-8"))
        captured = datetime.fromisoformat(raw["captured_at"].replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        if captured.tzinfo is None or captured > now:
            raise ValueError("Invalid timestamp")
        fields = ("confirmed_subscribers", "excluded_test_contacts")
        if any(type(raw.get(key)) is not int or raw[key] < 0 for key in fields):
            raise ValueError("Invalid count")
        if raw.get("source") != "Brevo browser verification":
            raise ValueError("Unknown source")
        result.update({key: raw[key] for key in fields})
        result.update(captured_at=captured.isoformat(), status="Opgeslagen momentopname",
                      stale=(now - captured).total_seconds() >= 86400)
    except (OSError, ValueError, KeyError, TypeError, AttributeError):
        pass
    return result
