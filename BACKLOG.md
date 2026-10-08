# Oness.one — Backlog

Last updated: 2026-10-09

This is a review queue, not authorization to change production. Do not implement a backlog item until its scope and risk are understood; ask for approval where required.

## B001 — Review legacy `file:///` authoring paths
- **Status:** Open
- **Priority:** Low
- **Scope:** Inspect affected legacy Patanjali/yoga-sutra HTML pages and determine whether local-file links appear to users or are inert authoring residue.
- **Acceptance:** Findings documented by file/path; any cleanup is narrowly scoped and preserves content.

## B002 — Review pages missing `<title>`
- **Status:** Open
- **Priority:** Low
- **Scope:** Identify affected pages and distinguish important public pages from legacy artifacts.
- **Acceptance:** A reviewed list and an explicit per-group decision; no blind mass-edit.

## B003 — Decide `www.oness.one` behavior
- **Status:** Open
- **Priority:** Medium
- **Scope:** Decide whether `www.oness.one` should redirect to the apex domain or be handled another way.
- **Acceptance:** Decision recorded before DNS, redirect, or canonical URL changes.

## B004 — Review legacy URL/redirect needs
- **Status:** Open
- **Priority:** Medium
- **Scope:** Identify historically important old URLs and assess whether redirects are necessary for continuity.
- **Acceptance:** Proposed mapping reviewed before any redirect implementation.

## B005 — Review oversized historical assets
- **Status:** Open
- **Priority:** Low
- **Scope:** Inspect only candidates supported by an audit; distinguish legitimate original assets from accidental or duplicate files.
- **Acceptance:** No asset is deleted or recompressed without a clear reason and approval.

## B006 — Review orphaned or legacy pages
- **Status:** Open
- **Priority:** Low
- **Scope:** Determine whether pages are intentionally retained, unlinked, obsolete, or candidates for later navigation work.
- **Acceptance:** Inventory and recommendations; no deletions based solely on orphan status.

## B007 — Evaluate runtime code only if needed
- **Status:** Deferred
- **Priority:** Low
- **Scope:** Consider a `worker.js` or other runtime customization only if a concrete behavior cannot be handled safely with the existing static site/Worker configuration.
- **Acceptance:** Need and alternatives documented before implementation. Do not add files for formality.

## B008 — Final custom-domain readiness review
- **Status:** Blocked pending review and approval
- **Priority:** High
- **Scope:** Validate repository, preview deployment, canonical URLs, redirects, robots/sitemap, HTTPS, and expected `www` behavior.
- **Acceptance:** Checklist in `AUDIT.md` passes for the current state and the user explicitly approves reconnecting `oness.one` and any required DNS changes.

## Working rules
- Prefer the smallest reversible change.
- Keep content preservation as the default.
- Run and record relevant checks after implementation.
- Update this backlog when an item is completed, deferred, or split into smaller tasks.
