#!/usr/bin/env python3
"""Read-only audit of the Oness.one static-site repository."""
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re, subprocess

ROOT = Path(".").resolve()
HTML_EXTS = {".html", ".htm"}
TEXT_EXTS = HTML_EXTS | {".css", ".js", ".json", ".xml", ".txt", ".md", ".svg"}
ATTRS = {"href", "src", "poster", "background", "action", "data"}
LIMIT = 80

def tracked_files():
    raw = subprocess.check_output(["git", "ls-files", "-z"])
    return [ROOT / x.decode("utf-8", "surrogateescape") for x in raw.split(b"\0") if x and (ROOT / x.decode("utf-8", "surrogateescape")).is_file()]

def read_text(p):
    return p.read_text(encoding="utf-8", errors="replace")

def rel(p):
    return p.relative_to(ROOT).as_posix()

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.refs = []
    def handle_starttag(self, tag, attrs):
        for k, v in attrs:
            if not v:
                continue
            if k.lower() in ATTRS:
                self.refs.append((v.strip(), k.lower()))
            elif k.lower() == "srcset":
                for part in v.split(","):
                    bits = part.strip().split()
                    if bits:
                        self.refs.append((bits[0], "srcset"))

def target_for(source, raw):
    raw = raw.strip().replace("&amp;", "&")
    if not raw or raw.startswith("#") or raw.lower().startswith("file:"):
        return None
    u = urlsplit(raw)
    if u.scheme or u.netloc:
        return None
    p = unquote(u.path).replace("\\", "/")
    if not p:
        return None
    candidate = (ROOT / p.lstrip("/")) if p.startswith("/") else (source.parent / p)
    try:
        candidate = candidate.resolve()
        candidate.relative_to(ROOT)
        return candidate
    except Exception:
        return None

def target_exists(p):
    if p.is_file():
        return True
    if p.is_dir():
        return any((p / n).is_file() for n in ("index.html", "index.htm", "index.shtml"))
    if not p.suffix:
        return any(Path(str(p) + s).is_file() for s in (".html", ".htm"))
    return False

files = tracked_files()
html = [p for p in files if p.suffix.lower() in HTML_EXTS]
textfiles = [p for p in files if p.suffix.lower() in TEXT_EXTS]
findings = defaultdict(list)
titles = Counter()
homepage = ROOT / "index.html"
home_text = read_text(homepage) if homepage.exists() else ""
home_refs = re.findall(r"""(?:src|href|background)\s*=\s*["']([^"']+)["']""", home_text, re.I)
home_missing = []

for p in textfiles:
    s = read_text(p)
    low = s.lower()
    for needle, key in [
        ("awakenology.org/oness/", "legacy_domain"),
        ("/oness/", "legacy_path"),
        ("xmgz", "xmgz"),
        ("juliank", "juliank"),
        ("file:///", "file_urls"),
    ]:
        if needle in low:
            findings[key].append(rel(p))
    if p.suffix.lower() not in HTML_EXTS:
        continue
    ts = re.findall(r"<title\b[^>]*>(.*?)</title\s*>", s, re.I | re.S)
    if not ts:
        findings["missing_title"].append(rel(p))
    if len(ts) > 1:
        findings["duplicate_title_tags"].append(rel(p))
    if ts:
        title = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", ts[0])).strip().lower()
        titles[title] += 1
    parser = Parser()
    try:
        parser.feed(s)
    except Exception:
        findings["html_parse_warnings"].append(rel(p))
    refs = list(parser.refs)
    refs.extend((u, "css-url") for u in re.findall(r"url\(\s*['\"]?([^'\")]+)", s, re.I))
    for raw, kind in refs:
        t = target_for(p, raw)
        if t is not None and not target_exists(t):
            findings["missing_local_refs"].append(f"{rel(p)} -> {raw} [{kind}]")

for raw in home_refs:
    t = target_for(homepage, raw)
    if t is not None and not target_exists(t):
        home_missing.append(raw)

for k in list(findings):
    findings[k] = sorted(set(findings[k]))

def count_files(name):
    return any(p.parent == ROOT and p.name.lower() == name for p in files)

head = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
out = [
    "# Oness.one — Automated Repository Audit",
    "",
    "Read-only scan. Findings are triage signals, not authorization to edit or delete legacy content.",
    "",
    "## Repository snapshot",
    f"- Git HEAD: {head}",
    f"- Tracked files scanned: {len(files):,}",
    f"- HTML/HTM pages scanned: {len(html):,}",
    f"- Text-like files scanned: {len(textfiles):,}",
    f"- Root robots.txt: {'present' if count_files('robots.txt') else 'absent'}",
    f"- Root sitemap.xml: {'present' if count_files('sitemap.xml') else 'absent'}",
    "",
    "## Findings",
]
labels = [
    ("legacy_domain", "Files containing legacy awakenology.org/oness/ URL"),
    ("legacy_path", "Files containing /oness/"),
    ("xmgz", "Files containing XMGZ, case-insensitive"),
    ("juliank", "Files containing JULIANK, case-insensitive"),
    ("file_urls", "Files containing file:/// authoring/local-file references"),
    ("missing_title", "HTML pages without a title tag"),
    ("duplicate_title_tags", "HTML pages with multiple title tags"),
    ("missing_local_refs", "Missing local references in HTML attributes or CSS URLs"),
    ("html_parse_warnings", "HTML parser warnings"),
]
for key, label in labels:
    items = findings[key]
    out.append(f"### {label}: {len(items):,}")
    out.extend(f"- {x}" for x in items[:LIMIT])
    if len(items) > LIMIT:
        out.append(f"- Plus {len(items)-LIMIT:,} additional items not shown.")
    if not items:
        out.append("- None detected.")
    out.append("")
out.extend([
    "## Homepage references",
    f"- index.html present: {'yes' if homepage.exists() else 'no'}",
    f"- Local homepage references parsed: {len(home_refs):,}",
    f"- Missing local homepage references: {len(home_missing):,}",
])
out.extend(f"- {x}" for x in home_missing[:LIMIT])
out.extend(["", "## Most common title text (top 20)"])
out.extend(f"- {n:,} page(s): {title[:180] or '[empty title]'}" for title, n in titles.most_common(20))
out.extend([
    "",
    "## Interpretation limits",
    "- This scan does not compare every page against the original 4.5 GB archive and cannot prove byte-for-byte preservation.",
    "- It checks literal local references in HTML attributes and CSS url() expressions; JavaScript-generated paths, unusual markup, runtime routing, and remote URLs are not fully validated.",
    "- A reported missing reference may be an intentional legacy artifact or a path convention requiring manual review.",
    "- No site content, assets, DNS, Worker configuration, or deployment was changed by this scan.",
])
Path("AUDIT-RESULTS.md").write_text("\n".join(out) + "\n", encoding="utf-8")
print(f"Wrote AUDIT-RESULTS.md: {len(files)} files, {len(html)} HTML/HTM pages.")
