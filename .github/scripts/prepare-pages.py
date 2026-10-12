#!/usr/bin/env python3
from pathlib import Path
import shutil, re, os

root = Path(".")
out = root / "_site"
shutil.rmtree(out, ignore_errors=True)
shutil.copytree(root, out, ignore=shutil.ignore_patterns(".git", ".github", "_site", "node_modules", ".wrangler"))

count = 0
for page in (out / "chinese").rglob("*"):
    if not page.is_file() or page.suffix.lower() not in {".htm", ".html"}:
        continue
    rel = Path(os.path.relpath(out / "chinese" / "zh-switch.js", page.parent)).as_posix()
    html = page.read_text(encoding="utf-8", errors="replace")
    if "oness-zh-switch" in html:
        continue
    tag = '<script src="' + rel + '" data-oness-zh-switch defer></script>\n'
    match = re.search(r"</head\s*>", html, re.I)
    if match:
        html = html[:match.start()] + tag + html[match.start():]
    else:
        match = re.search(r"<body\b[^>]*>", html, re.I)
        if match:
            html = html[:match.end()] + "\n" + tag + html[match.end():]
        else:
            html += "\n" + tag
    page.write_text(html, encoding="utf-8")
    count += 1
print("Added 简 / 繁 switch to", count, "Chinese HTML pages")
