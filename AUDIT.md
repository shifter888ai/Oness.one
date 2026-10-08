# Oness.one — Audit Checklist

Last audit baseline recorded: 2026-10-09  
Last known pre-governance baseline commit: `040378299208790b0a096adb54afc82d1a11dd0a`

Use this checklist before major commits and before reconnecting the custom domain. Mark items only after checking the current repository/runtime; historical baseline results are not proof that later changes still pass.

## A. Git and repository
- [ ] Confirm repository is `shifter888ai/Oness.one` and branch is `main`.
- [ ] Record current commit SHA and inspect the diff.
- [ ] Confirm only intended files changed.
- [ ] Check for accidental secrets, credentials, personal data, archives, or executable files.
- [ ] Confirm project governance files are committed and available from GitHub.

## B. Branding and domain
- [ ] Target branding is Oness.one where applicable.
- [ ] No unintended JULIANK branding has been reintroduced.
- [ ] No production references point back to `awakenology.org/oness/`.
- [ ] No unintended old `/oness/` path references remain.
- [ ] Review canonical URL, sitemap, robots directives, and internal links if changed.
- [ ] Decide expected `www.oness.one` behavior before changing DNS or canonical URLs.

## C. Content preservation
- [ ] Original text, paragraph order, images, language variants, and meaningful links remain intact unless a specific change was approved.
- [ ] No mass HTML formatting or rewriting occurred.
- [ ] No historical content was removed based only on automated warnings.
- [ ] Known historical `JulianKeaber` reference strings were preserved unless explicitly approved for editing.

## D. Homepage
- [ ] Homepage loads and uses the intended original `200w.gif` image.
- [ ] All four language hover image references resolve to existing assets.
- [ ] Language navigation/hover behavior remains functional.
- [ ] No accidental layout or image-size regressions.

## E. HTML and navigation
- [ ] Check for duplicate title tags in the relevant audit scope.
- [ ] Review missing-title findings individually; do not mass-add titles without review.
- [ ] Check internal navigation and language paths after URL changes.
- [ ] Review legacy `file:///` paths individually; do not strip them blindly.
- [ ] Check for broken links or missing assets in the changed scope.

## F. Images and assets
- [ ] Local asset references resolve.
- [ ] No legacy XMGZ external asset URLs remain.
- [ ] No missing local XMGZ references remain.
- [ ] Check image scale and layout only where relevant to the current change.
- [ ] Avoid adding oversized, duplicate, or unnecessary production assets.

## G. Runtime and deployment
- [ ] Confirm the Cloudflare Worker name and deployment target before changing anything.
- [ ] Test the Worker preview URL when runtime files or routing behavior change.
- [ ] Verify status/response and representative pages after deployment.
- [ ] Do not create `worker.js` without a concrete need.
- [ ] Do not deploy production changes without explicit approval.

## H. Custom domain reconnection gate
- [ ] Complete the relevant repository and content audits.
- [ ] Confirm expected canonical host and `www` behavior.
- [ ] Verify HTTPS and representative URLs on the Worker preview.
- [ ] Review redirects, robots.txt, sitemap, and any absolute URL references.
- [ ] Obtain explicit user approval before reconnecting `oness.one` or changing DNS/nameservers.
- [ ] After approval and change, verify domain routing and HTTPS.

## Recorded baseline results (2026-10-09)
The prior read-only audit reported:
- 10,890 tracked files; 7,261 HTML/HTM pages.
- 11 expected `Oness.one` branded-title files.
- Zero legacy domain references in production.
- Zero legacy `/oness/` path references.
- Zero XMGZ legacy external asset URLs.
- Zero missing local XMGZ references.
- Zero duplicate title tags in the audited scope.
- No unexpected executable/archive files committed.
- No suspicious large production files.
- Four homepage language-hover references and their images were present.

## Known exceptions to track
- Legacy Windows/RAR `file:///` authoring paths in some Patanjali/yoga-sutra pages.
- Some legacy HTML pages without `<title>`.
- Historical `JulianKeaber` strings in:
  - `chinese/qita/files/cosmology_and_life/63096.html`
  - `chinese/qita/files/cosmology_and_life/64080.html`
- Custom domain `oness.one` is detached from the Worker pending final review and explicit approval.

Re-run applicable checks after changes. If an item cannot be verified, leave it unchecked and report the limitation.
