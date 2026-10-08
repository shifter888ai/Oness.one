# Oness.one — Master Rules

Last updated: 2026-10-09

## 1. Project identity
- This repository contains the migration of the legacy Oness website from `https://awakenology.org/oness/` to the new website project at **Oness.one**.
- GitHub repository: `shifter888ai/Oness.one`.
- Cloudflare Worker: `oness-one`.
- Known Worker preview URL: `https://oness-one.shifter888.workers.dev`.
- The original source archive is approximately 4.5 GB and remains in the user's cloud drive. It is a recovery/reference source; the latest Git history is the working baseline.

## 2. Core principles
1. **Preserve first.** Do not remove, rewrite, translate, reformat, or restructure legacy content unless the user explicitly approves the specific change.
2. **Simple is best.** Prefer lightweight, reversible, low-complexity solutions over frameworks or elaborate tooling.
3. **Audit before editing.** Establish the actual repository state and scope before making changes.
4. **Verify after editing.** Run the relevant audit and inspect the diff before committing.
5. **Keep work portable.** Put durable project rules, audit records, and backlog items in GitHub rather than relying on a single computer's local files.
6. **Be transparent.** Report errors and incomplete checks accurately. Never claim that a change, deployment, or verification succeeded unless confirmed.

## 3. Domain and branding
- The target project/domain is **Oness.one**.
- The former source URL `https://awakenology.org/oness/` is migration history, not the target canonical location.
- Do not reintroduce legacy `awakenology.org/oness/` production references.
- Existing approved branding cleanup removed JULIANK branding from 12 Oness pages. Do not reintroduce that branding without explicit approval.
- Historical names or references inside preserved source content (including the two known `JulianKeaber` book/reference strings) are not automatically errors and must not be deleted just because they look old.
- Decide and document any `www.oness.one` behavior before changing DNS or canonical URLs.

## 4. Content and legacy files
- Preserve original text, images, language variants, links, and historical artifacts by default.
- Do not mass-edit legacy HTML just to make it conform to modern conventions.
- Do not blindly remove legacy `file:///` authoring references; inspect context and determine whether they affect public behavior before changing them.
- Do not mass-add missing HTML title tags without reviewing the affected pages and intended metadata.
- Avoid deleting files or changing URLs based solely on an automated warning.
- Maintain the existing homepage language hover images and their references unless a user-approved redesign replaces them.

## 5. Implementation and hosting
- Keep the site as static/lightweight as practical.
- Do not introduce a framework, build step, server-side dependency, or new Worker code without a concrete need and user approval.
- Do not create `worker.js` solely for formality.
- The known Worker preview deployment has been tested by the user and looked good after the latest branding cleanup.
- The custom domain `oness.one` was intentionally detached from the Worker pending final audit and approval. **Do not reconnect the custom domain, change DNS/nameservers, or deploy production changes without explicit user approval.**
- Never invent deployment status; verify the relevant Cloudflare/GitHub state where tools allow it.

## 6. Git and change control
- Work against the current GitHub repository state; do not assume a local folder is a Git repository until `.git` and `git status` confirm it.
- Before editing, inspect the branch, current commit, and relevant files.
- Keep changes narrowly scoped and reversible.
- Never overwrite existing files without fetching and reviewing their current contents first.
- Do not commit credentials, API keys, access tokens, personal data, or unnecessary archives.
- Before committing, review changed files and run applicable checks.
- After committing, verify the commit and changed paths on GitHub.
- Never force-push or rewrite history unless the user explicitly approves.

## 7. Current known baseline
As of 2026-10-09, the last known remote `main` commit before governance-file creation was `0403782` (full SHA previously recorded as `040378299208790b0a096adb54afc82d1a11dd0a`).
The migration audit recorded:
- 10,890 tracked files.
- 7,261 HTML/HTM pages.
- 11 expected `Oness.one` branded-title files.
- Zero legacy domain references in production.
- Zero old `/oness/` path references.
- Zero XMGZ legacy external asset URLs and zero missing local XMGZ references.
- Zero duplicate title tags in the audited scope.
- No unexpected executable/archive files committed and no suspicious large production files.
- All four homepage language-hover references and corresponding images present.

These are historical audit results, not a substitute for rerunning checks after later changes.

## 8. Known non-blocking exceptions
- Some old Patanjali/yoga-sutra HTML pages contain Windows/RAR extraction `file:///` authoring paths. Review before any cleanup.
- Some legacy HTML pages lack `<title>`; do not mass-fix without review.
- Two historical `JulianKeaber` book/reference strings remain in `chinese/qita/files/cosmology_and_life/63096.html` and `64080.html`; preserve unless the user directs otherwise.
- The custom domain is detached pending audit and explicit approval.

## 9. Standard workflow
1. Read these rules and the current `AUDIT.md` and `BACKLOG.md`.
2. Check GitHub `main`, current commit, and working scope.
3. Define the smallest safe change; ask when approval is needed.
4. Make the change without unrelated edits.
5. Run relevant validation and compare against the original where content preservation matters.
6. Inspect the diff and record remaining exceptions.
7. Commit/push only the intended files.
8. Verify the resulting commit and paths.
9. Treat production deployment/domain changes as a separate approval step.

## 10. Portability and recovery
- The authoritative ongoing project state is the GitHub repository and its history, together with the original ZIP stored in the user's cloud drive.
- On a new computer, clone the latest repository first. Use the original ZIP as reference/recovery material, not as a replacement for newer committed changes.
- Keep project-specific rules and audit history in this repository so work can continue across computers.
