#!/usr/bin/env python3
"""Check .vercelignore against public pages and local editorial files.

Uses Git's ignore matcher in temporary storage, not the project's .gitignore.
This is a local configuration check, not proof of a deployed artifact.
"""
import json
import subprocess
import tempfile
from pathlib import Path

from check_publication_verification import html_files, parse_page, sitemap_paths

ROOT = Path(__file__).resolve().parents[1]


def main():
    public = sitemap_paths()
    pages = {p.relative_to(ROOT).as_posix(): parse_page(p, p.relative_to(ROOT).as_posix() in public)
             for p in html_files()}
    public |= {path for path, page in pages.items() if page.published}
    # These exceptions are real public support/redirect files, not editorial concepts.
    support = {'404.html', 'expertise.html', 'beeldbank/index.html'}
    private = {path for path, page in pages.items()
               if not page.published and path not in support}
    for folder in ('concepten', 'docs', 'tools', 'codex-skills', 'local-admin', 'local-mail-preview'):
        private |= {p.relative_to(ROOT).as_posix() for p in (ROOT / folder).rglob('*') if p.is_file()}
    private.add('PUBLICATIE_REGISTER.json')
    required = public | {'robots.txt', 'sitemap.xml', 'styles.css', 'script.js', 'content.js', 'api/contact.js', '404.html', 'expertise.html'}
    required |= {p.relative_to(ROOT).as_posix() for p in (ROOT / 'assets').rglob('*') if p.is_file()}
    required |= {p.relative_to(ROOT).as_posix() for p in (ROOT / 'data').glob('*.json')}
    candidates = sorted(private | required)
    with tempfile.TemporaryDirectory(prefix='mvd-deployment-check-') as folder:
        subprocess.run(['git', 'init', '-q', folder], check=True)
        Path(folder, '.gitignore').write_bytes((ROOT / '.vercelignore').read_bytes())
        result = subprocess.run(['git', '-c', 'core.excludesFile=/dev/null', 'check-ignore', '--no-index', '-z', '--stdin'],
                                cwd=folder, input='\0'.join(candidates)+'\0', text=True, capture_output=True)
        if result.returncode not in (0, 1):
            raise RuntimeError(result.stderr)
        excluded = set(filter(None, result.stdout.split('\0')))
    issues = [('private_file_not_excluded', p) for p in sorted(private-excluded)]
    issues += [('public_file_excluded', p) for p in sorted(required & excluded)]
    print(json.dumps({'public_pages': len(public), 'private_files_checked': len(private),
                      'required_files_checked': len(required), 'issues': issues}, ensure_ascii=False, indent=2))
    return bool(issues)


if __name__ == '__main__':
    raise SystemExit(main())
