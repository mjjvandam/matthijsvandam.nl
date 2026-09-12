"""Lossless, deliberately narrow article importer and renderer for the local pilot.

The stored template and editable document are one revision input. Public files are
never written here. A baseline round trip is byte-for-byte identical.
"""
from __future__ import annotations

import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import urljoin, urlsplit

PILOT_ID = "leonie-meihuizen-onderzoeker-transmuraal-tilburg-cohort"
SITE_URL = "https://matthijsvandam.nl/"
TEXT_FIELDS = ("title", "lead", "meta_title", "meta_description", "social_title",
               "social_description", "card_title", "card_summary", "image_alt")
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class ValidationError(ValueError):
    pass


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def digest(value):
    if not isinstance(value, bytes):
        value = value.encode("utf-8")
    return hashlib.sha256(value).hexdigest()


class SourceParser(HTMLParser):
    """Offsets into original source; only edited spans are ever replaced."""
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.lines = [0]
        self.lines.extend(m.end() for m in re.finditer("\n", source))
        self.nodes, self.stack = [], []
        self.feed(source)
        self.close()

    def char_offset(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col

    def handle_starttag(self, tag, attrs):
        start = self.char_offset()
        node = {"tag": tag, "attrs": dict(attrs), "start": start,
                "open_end": start + len(self.get_starttag_text()),
                "parent": self.stack[-1] if self.stack else None}
        self.nodes.append(node)
        if tag in VOID:
            node["inner_end"] = node["end"] = node["open_end"]
        else:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if self.stack and self.stack[-1]["tag"] == tag:
            node = self.stack.pop()
            node["inner_end"] = node["end"] = node["open_end"]

    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1]["tag"] != tag:
            raise ValidationError("De vaste artikeltemplate heeft onverwachte HTML-nesting.")
        node = self.stack.pop()
        node["inner_end"] = self.char_offset()
        node["end"] = self.source.index(">", node["inner_end"]) + 1


def has_class(node, name):
    return name in (node["attrs"].get("class") or "").split()


def plain(fragment):
    return " ".join(html.unescape(re.sub(r"<[^>]*>", "", fragment)).split())


def read_card(content, article_id):
    marker = re.search(r'\bid:\s*' + re.escape(json.dumps(article_id)), content)
    if not marker:
        raise ValidationError("Artikelkaart ontbreekt in content.js.")
    start = content.rfind("{", 0, marker.start())
    end = content.find("\n    }", marker.end()) + len("\n    }")
    raw = content[start:end]
    if not raw.endswith("}"):
        raise ValidationError("Artikelkaart is niet herkenbaar.")
    fields = {}
    for match in re.finditer(r'\b(\w+)\s*:\s*("(?:\\.|[^"\\])*"|\[[^\]]*\]|true|false)', raw):
        fields[match.group(1)] = json.loads(match.group(2))
    if fields.get("id") != article_id or not all(k in fields for k in ("title", "summary", "url", "image", "imageAlt")):
        raise ValidationError("Artikelkaart is onvolledig.")
    return fields, raw


def import_article(repo, article_id=PILOT_ID):
    if article_id != PILOT_ID:
        raise ValidationError("Alleen het vooraf gecontroleerde pilotartikel is bewerkbaar.")
    path = f"artikelen/{article_id}.html"
    source = (Path(repo) / path).read_text(encoding="utf-8")
    nodes = SourceParser(source).nodes
    main = next(n for n in nodes if n["tag"] == "main")
    article = next(n for n in nodes if n["tag"] == "article" and n["parent"] is main)
    children = [n for n in nodes if n["parent"] is article]
    title = next(n for n in children if n["tag"] == "h1")
    lead = next(n for n in children if has_class(n, "lead"))
    hero = next(n for n in children if has_class(n, "article-hero-image"))
    end = next(n["start"] for n in children if has_class(n, "related-section"))
    blocks = [n for n in children if lead["end"] < n["start"] < end and
              n["tag"] in {"h2", "p"} and not has_class(n, "article-byline")]
    if len(blocks) != 9:
        raise ValidationError("De pilottemplate is gewijzigd: controleer eerst de tekstvelden.")
    card, card_raw = read_card((Path(repo) / "content.js").read_text(encoding="utf-8"), article_id)
    def inner(node):
        return source[node["open_end"]:node["inner_end"]]
    def meta(key):
        return next(n["attrs"]["content"] for n in nodes if n["tag"] == "meta" and
                    (n["attrs"].get("name") == key or n["attrs"].get("property") == key))
    document = {"title": plain(inner(title)), "lead": plain(inner(lead)),
                "meta_title": plain(inner(next(n for n in nodes if n["tag"] == "title"))),
                "meta_description": meta("description"), "social_title": meta("og:title"),
                "social_description": meta("og:description"), "card_title": card["title"],
                "card_summary": card["summary"], "image_alt": hero["attrs"]["alt"],
                "blocks": [{"id": f"block-{i+1}", "tag": n["tag"], "html": inner(n)} for i, n in enumerate(blocks)]}
    model = {"id": article_id, "path": path, "template": source,
             "baseline": document, "card": card, "card_raw": card_raw}
    validate_document(document, document)
    return model


class InlineValidator(HTMLParser):
    tags = {"a", "strong", "em", "b", "i", "br", "sup", "sub"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []

    def handle_starttag(self, tag, attrs):
        if tag not in self.tags:
            raise ValidationError(f"Opmaak '{tag}' wordt niet ondersteund; gebruik tekst, vet, cursief of een link.")
        seen = set()
        for key, value in attrs:
            if key in seen or key not in ({"href", "title", "rel"} if tag == "a" else set()):
                raise ValidationError("Deze HTML-eigenschap is niet toegestaan.")
            seen.add(key)
            if value is None:
                raise ValidationError("HTML-eigenschap mist een waarde.")
            if key == "href":
                validate_link(value)
            if key == "rel" and not set(value.split()) <= {"noopener", "noreferrer", "nofollow"}:
                raise ValidationError("Linkeigenschap is niet toegestaan.")
        if tag == "a" and "href" not in seen:
            raise ValidationError("Een link heeft een adres nodig.")
        if tag != "br":
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag != "br":
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if not self.stack or self.stack.pop() != tag:
            raise ValidationError("Tekstopmaak is niet correct afgesloten.")

    def handle_comment(self, data):
        raise ValidationError("HTML-commentaar is niet toegestaan.")

    def handle_decl(self, decl):
        raise ValidationError("HTML-declaraties zijn niet toegestaan.")

    def handle_pi(self, data):
        raise ValidationError("HTML-instructies zijn niet toegestaan.")


def validate_link(value):
    if not value or any(ord(c) < 32 for c in value) or "\\" in value:
        raise ValidationError("Ongeldig linkadres.")
    parsed = urlsplit(value.strip())
    if parsed.scheme and parsed.scheme.lower() not in {"https", "http", "mailto", "tel"}:
        raise ValidationError("Alleen gewone website-, e-mail- en telefoonlinks zijn toegestaan.")
    if value.strip().startswith("//") or (parsed.scheme in {"http", "https"} and not parsed.hostname):
        raise ValidationError("Gebruik een volledig https-adres voor externe links.")


def validate_document(document, baseline):
    if not isinstance(document, dict) or set(document) != set(baseline):
        raise ValidationError("De artikelvelden zijn niet compleet of bevatten onbekende velden.")
    for key in TEXT_FIELDS:
        value = document[key]
        if not isinstance(value, str) or not value.strip() or len(value) > (12000 if key == "lead" else 2000):
            raise ValidationError(f"Vul een geldige tekst in voor {key}.")
        if any(ord(c) < 32 and c not in "\n\r\t" for c in value):
            raise ValidationError("Tekst bevat ongeldige tekens.")
    blocks = document["blocks"]
    if not isinstance(blocks, list) or len(blocks) != len(baseline["blocks"]):
        raise ValidationError("Het aantal tekstblokken staat vast in deze pilot.")
    for block, original in zip(blocks, baseline["blocks"]):
        if not isinstance(block, dict) or set(block) != {"id", "tag", "html"} or any(block[k] != original[k] for k in ("id", "tag")):
            raise ValidationError("De volgorde en het type tekstblokken staan vast.")
        value = block["html"]
        if not isinstance(value, str) or len(value) > 30000 or not plain(value).strip():
            raise ValidationError("Een tekstblok moet leesbare tekst bevatten.")
        parser = InlineValidator()
        parser.feed(value)
        parser.close()
        if parser.stack:
            raise ValidationError("Tekstopmaak is niet correct afgesloten.")
    if len(canonical(document).encode()) > 200000:
        raise ValidationError("Het artikel is te groot.")
    return document


def replace_attribute(source, node, name, value):
    opening = source[node["start"]:node["open_end"]]
    pattern = re.compile(r'(\b' + re.escape(name) + r'\s*=\s*)([\"\'])(.*?)\2', re.S)
    changed, count = pattern.subn(lambda m: m.group(1) + m.group(2) + html.escape(value, quote=True) + m.group(2), opening, count=1)
    if count != 1:
        raise ValidationError("De template-eigenschap ontbreekt.")
    return (node["start"], node["open_end"], changed)


def render_article(model, document):
    baseline, source = model["baseline"], model["template"]
    validate_document(document, baseline)
    if document == baseline:
        return source
    nodes = SourceParser(source).nodes
    changes = []
    def inner(node, text, raw=False):
        changes.append((node["open_end"], node["inner_end"], text if raw else html.escape(text)))
    if document["title"] != baseline["title"]:
        inner(next(n for n in nodes if n["tag"] == "h1"), document["title"])
    if document["lead"] != baseline["lead"]:
        inner(next(n for n in nodes if has_class(n, "lead")), document["lead"])
    if document["meta_title"] != baseline["meta_title"]:
        inner(next(n for n in nodes if n["tag"] == "title"), document["meta_title"])
    for node in nodes:
        if node["tag"] == "meta":
            key = node["attrs"].get("name") or node["attrs"].get("property")
            field = {"description": "meta_description", "og:title": "social_title", "twitter:title": "social_title",
                     "og:description": "social_description", "twitter:description": "social_description",
                     "og:image:alt": "image_alt", "twitter:image:alt": "image_alt"}.get(key)
            if field and document[field] != baseline[field]:
                changes.append(replace_attribute(source, node, "content", document[field]))
        if has_class(node, "article-hero-image") and document["image_alt"] != baseline["image_alt"]:
            changes.append(replace_attribute(source, node, "alt", document["image_alt"]))
        if node["tag"] == "script" and node["attrs"].get("type") == "application/ld+json":
            data = json.loads(source[node["open_end"]:node["inner_end"]])
            modified = False
            for field, key in (("title", "headline"), ("meta_description", "description")):
                if document[field] != baseline[field]:
                    data[key] = document[field]
                    modified = True
            if modified:
                inner(node, "\n" + json.dumps(data, ensure_ascii=False, indent=2).replace("<", "\\u003c") + "\n", raw=True)
    main_article = next(n for n in nodes if n["tag"] == "article" and n["parent"] and n["parent"]["tag"] == "main")
    lead = next(n for n in nodes if has_class(n, "lead"))
    end = next(n["start"] for n in nodes if n["parent"] is main_article and has_class(n, "related-section"))
    block_nodes = [n for n in nodes if n["parent"] is main_article and lead["end"] < n["start"] < end and n["tag"] in {"h2", "p"} and not has_class(n, "article-byline")]
    for node, block, original in zip(block_nodes, document["blocks"], baseline["blocks"]):
        if block["html"] != original["html"]:
            inner(node, block["html"], raw=True)
    for start, end, value in sorted(changes, reverse=True):
        source = source[:start] + value + source[end:]
    return source


def render_card(model, document):
    card = dict(model["card"])
    card.update(title=document["card_title"], summary=document["card_summary"], imageAlt=document["image_alt"])
    return card


def render_content_js(model, document, repo):
    source = (Path(repo) / "content.js").read_text(encoding="utf-8")
    _, raw = read_card(source, model["id"])
    if raw != model["card_raw"]:
        raise ValidationError("De oorspronkelijke artikelkaart is buiten beheer gewijzigd. Vergelijk en importeer die wijziging eerst bewust.")
    changed = raw
    card = render_card(model, document)
    for key in ("title", "summary", "imageAlt"):
        if card[key] != model["card"][key]:
            pattern = re.compile(r'(\b' + key + r'\s*:\s*)("(?:\\.|[^"\\])*")')
            changed = pattern.sub(lambda m: m.group(1) + json.dumps(card[key], ensure_ascii=False).replace("<", "\\u003c"), changed, count=1)
    return source.replace(raw, changed, 1)


def asset_paths(model, repo):
    """Only local static rendering inputs, recursively including CSS assets."""
    repo = Path(repo).resolve()
    paths = {"styles.css", "script.js", "content.js", model["path"]}
    parsed = SourceParser(model["template"])
    for node in parsed.nodes:
        if node["tag"] not in {"img", "script", "link", "source"}:
            continue
        value = node["attrs"].get("src") or node["attrs"].get("href") or ""
        url = urlsplit(urljoin(SITE_URL + model["path"], value))
        if url.hostname == "matthijsvandam.nl":
            paths.add(url.path.lstrip("/"))
    paths.add(model["card"]["image"])
    for path in list(paths):
        if path.endswith(".css") and (repo / path).is_file():
            css = (repo / path).read_text(encoding="utf-8")
            for value in re.findall(r'url\(\s*[\"\']?([^\)\"\']+)', css):
                url = urlsplit(urljoin(SITE_URL + path, value.strip()))
                if url.hostname == "matthijsvandam.nl":
                    paths.add(url.path.lstrip("/"))
    return sorted(path for path in paths if (repo / path).resolve().is_relative_to(repo))


def fingerprint(model, document, repo):
    repo = Path(repo)
    if not (repo / model["path"]).is_file() or digest((repo / model["path"]).read_bytes()) != digest(model["template"]):
        raise ValidationError("De publieke artikelbron is buiten beheer gewijzigd. Vergelijk en importeer die wijziging eerst bewust; het oude concept kan nog worden bekeken.")
    inputs = {}
    for path in asset_paths(model, repo):
        if not (repo / path).is_file():
            raise ValidationError(f"Een weergavebestand ontbreekt: {path}")
        inputs[path] = digest((repo / path).read_bytes())
    inputs["renderer:content_model.py"] = digest(Path(__file__).read_bytes())
    inputs["renderer:server.py"] = digest(Path(__file__).with_name("server.py").read_bytes())
    inputs["stored-template"] = digest(model["template"])
    inputs["imported-card"] = digest(model["card_raw"])
    page, card = render_article(model, document), render_card(model, document)
    data = {"source": digest(canonical(document)), "dependencies": inputs,
            "html": digest(page), "card": digest(canonical(card)),
            "content_js": digest(render_content_js(model, document, repo))}
    return {"hash": digest(canonical(data)), **data}


def protect_preview(source, path, revision=None, *, local_url=None, repo=None, reference=False):
    # A <base> keeps styles/images local, so fragments need the full local route.
    # Existing treatment pages stay behind the same protected reading endpoint.
    local_url = local_url or "/reference/" + path
    treatment_paths = set()
    if repo is not None:
        treatment_root = (Path(repo) / "behandelingen").resolve()
        treatment_paths = {
            "/behandelingen/" + candidate.name
            for candidate in treatment_root.glob("*.html")
            if re.fullmatch(r"[a-z0-9-]+\.html", candidate.name) and candidate.is_file()
            and not candidate.is_symlink() and candidate.resolve().is_relative_to(treatment_root)
        }
    nodes = SourceParser(source).nodes
    changes = []
    for node in nodes:
        if node["tag"] == "a" and node["attrs"].get("href"):
            value = node["attrs"]["href"]
            resolved = urlsplit(urljoin(SITE_URL + path, value))
            local = False
            destination = None
            if value.startswith("#"):
                destination, local = local_url.split("#", 1)[0] + value, True
            elif resolved.hostname in {"matthijsvandam.nl", "www.matthijsvandam.nl"}:
                if resolved.path == "/" + path and resolved.fragment:
                    destination, local = local_url.split("#", 1)[0] + "#" + resolved.fragment, True
                elif resolved.path in treatment_paths:
                    destination, local = "/reference" + resolved.path, True
                    if resolved.query:
                        destination += "?" + resolved.query
                    if resolved.fragment:
                        destination += "#" + resolved.fragment
                elif not urlsplit(value).scheme:
                    destination = urljoin(SITE_URL + path, value)
            elif not urlsplit(value).scheme:
                destination = urljoin(SITE_URL + path, value)
            if destination is not None:
                start, end, opening = replace_attribute(source, node, "href", destination)
                if local:
                    target = re.compile(r'(\s)target\s*=\s*([\"\'])(.*?)\2', re.S | re.I)
                    if target.search(opening):
                        opening = target.sub(' target="_self"', opening, count=1)
                    else:
                        opening = opening[:-1] + ' target="_self">'
                changes.append((start, end, opening))
        if revision and node["tag"] == "script" and "content.js" in node["attrs"].get("src", ""):
            value = node["attrs"]["src"]
            value += ("&" if "?" in value else "?") + f"mvd_revision={revision}"
            changes.append(replace_attribute(source, node, "src", value))
        if node["tag"] == "meta" and node["attrs"].get("name") == "robots":
            changes.append(replace_attribute(source, node, "content", "noindex, nofollow"))
    for start, end, value in sorted(changes, reverse=True):
        source = source[:start] + value + source[end:]
    parent = str(Path(path).parent)
    source = source.replace("<head>", f'<head>\n    <base href="/site/{parent}/" target="_blank">', 1)
    if reference:
        banner = ('\n    <aside role="note" aria-label="Lokale leesversie" '
                  'style="position:relative;z-index:10000;padding:12px 20px;background:#fff1ce;'
                  'color:#382c10;border-bottom:2px solid #cfad4f;font:600 14px/1.5 system-ui,sans-serif;'
                  'text-align:center">Lokale leesversie · publicatiestatus in dashboard. '
                  '<a href="/#taken" target="_blank" rel="noopener" '
                  'style="color:inherit;text-decoration:underline">Open het dashboard</a></aside>')
        source = re.sub(r"(<body\b[^>]*>)", lambda match: match.group(1) + banner, source, count=1)
    return source


def preview_html(model, document, revision=None, repo=None):
    local_url = f'/preview/{model["id"]}' + (f"?revision={revision}" if revision is not None else "")
    return protect_preview(render_article(model, document), model["path"], revision,
                           local_url=local_url, repo=repo)
