#!/usr/bin/env python3
"""Generate static FAQ HTML and transitional FAQPage JSON-LD from one source."""

from __future__ import annotations

import argparse

from faq_lib import ROOT, generated_outputs, write_if_changed


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Fail when checked-in output differs")
    parser.add_argument("--write", action="store_true", help="Write generated output")
    args = parser.parse_args()
    if args.check == args.write:
        parser.error("Kies precies één van --check of --write")

    changed: list[str] = []
    for path, content in generated_outputs().items():
        if args.check:
            if path.read_text(encoding="utf-8") != content:
                changed.append(str(path.relative_to(ROOT)))
        elif write_if_changed(path, content):
            changed.append(str(path.relative_to(ROOT)))

    if args.check and changed:
        print("FAQ-output wijkt af van de centrale bron:")
        for path in changed:
            print(f"- {path}")
        return 1
    if args.check:
        print("FAQ-output gecontroleerd: alle statische HTML en markdown zijn actueel.")
        return 0

    if changed:
        print(f"FAQ-output bijgewerkt: {len(changed)} bestand(en).")
        for path in changed:
            print(f"- {path}")
    else:
        print("FAQ-output was al actueel.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
