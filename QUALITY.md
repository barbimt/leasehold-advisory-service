# Quality notes and self review

Notes on data, access, and the main technical choices, plus gaps I would
still flag and what I would do next.

## Personal data and security

**What we send.** The browser posts an optional situation key and optional
free text to `POST /api/triage/`. Extra JSON fields are rejected.

**What we store.** Nothing. There is no enquiry model and no log of the
request body. Django has a SQLite setting only because Django expects a
database. We do not write enquiries to it.

**What we do not collect.** Name, email, address, account numbers, or any
contact field.

**Retention, access, and deletion.** There is no stored record to keep,
share, or delete. If we stored enquiries later, I would keep them only as
long as needed, limit who can see them, and delete them on request.

**Risks and what we did.**

- People may still type personal details into free text. The form warns them
  not to. We use the text only for that request.
- The API is public (`AllowAny`) with no rate limit. That is acceptable for a
  local prototype. On the internet I would add rate limiting.
- Unused Django admin and DRF’s default Session/Basic authentication were
  extra surface. Admin is removed. Authentication classes are empty because
  this is a JSON API with no login. The frontend `fetch` does not send
  credentials.
- We did not add a scenario length cap. Known values are short. An unknown
  value already returns the unknown topic instead of a validation error. A
  made-up max length would change that for long unsupported strings without a
  clear product need.

`.env` is gitignored. The example secret is for local use only.

## Accessibility

**Checks.** ESLint `jsx-a11y` and axe-core in Vitest (first load, invalid
submit, known result, unknown result). Manual checks used the browser
accessibility tree, accessible names and descriptions, focus after each
main action (`document.activeElement`), a keyboard journey, zoom/reflow at
200% and 400% viewport equivalents, and a contrast spot-check.

VoiceOver was not run in this environment. Broader screen-reader testing is
listed under future work.

**What we improved in this pass.** Clearer privacy and situation copy. Service
errors no longer say “check your answers”. The document title updates on the
result. `aria-invalid` is no longer on the fieldset.

**Character count.** The remaining count stays as a hint linked with
`aria-describedby`. We did not add a live region that updates on every
keystroke. GOV.UK’s character count announces after the user stops typing, to
avoid noisy screen-reader updates. Our limit is 2000 characters, so most
people never get close. If the limit were much lower, I would look at delayed
or threshold announcements, not per-keystroke live regions.

**What we would do next.** Test with VoiceOver, NVDA, JAWS, and mobile
assistive technology. The footer “Accessibility statement” and “Privacy”
links go to lease-advice.org. They describe LEASE’s live site, not this
prototype.

These checks follow WCAG 2.2 AA as a guide. They are not a claim that the
prototype meets AA. Axe passing is not sufficient on its own.

## Key technical decisions

**Local React state.** One form owns the enquiry and the result. There is
nothing else on screen that needs to share that data.

**The result stays in memory after POST.** A URL could not rebuild it without
storing or replaying the enquiry, so extra routes would promise a
bookmarkable result we do not have.

**Relative `/api` and the Vite proxy.** Locally the browser talks to the Vite
origin. The default is still the relative `/api/triage/` path. An optional
public `VITE_API_BASE_URL` can point at a separate API origin. CORS is an
environment allowlist (`CORS_ALLOWED_ORIGINS`) for that split. Leave it
empty locally. Do not use allow-all origins.

**Native semantic controls.** Radios, textarea, buttons, labels, and a
fieldset. Accessibility starts with HTML, not ARIA on generic divs.

**GOV.UK Design System as guidance.** We wanted clear errors, focus, and
inset-style notices. We did not install GOV.UK Frontend. This is a LEASE
prototype, not a GOV.UK branded service, and a large Sass kit would not earn
its place here.

**Deterministic classifier.** A small phrase list in code, easy to read and
test. It will miss wording we did not list. That is accepted for this slice.

**Backend owns controlled guidance.** The API returns curated titles,
summaries, and LEASE URLs. The UI does not invent links or advice.

**Unknown is a valid outcome.** If we are not sure, we do not guess a topic.
That is safer than a wrong next step.

**SQLite only.** Django needs a database setting. We do not store enquiries.
Postgres and Docker had no product job, so they are not part of the
prototype.

## Self code review

**Strengths.** The slice is small and readable. Validation is server-side as
well as client-side. Enquiry text is not stored or echoed. Focus moves after
errors, submit, and reset. Tests cover each topic, unknown, extra fields, and
the main UI path.

**Risks.** Keyword matching can still miss ordinary wording, or look too
confident when a phrase is a poor fit. Choosing “I’m not sure” always leads
to the safe unknown outcome, even if the description would have matched.
People can still paste personal data into the box.

**Missing tests.** We added punctuation cases and locked the “not sure”
precedence. We did not add HTTP 405/415 tests. They would not change the
product story.

**Naming.** Scenario keys use underscores; topic slugs use hyphens. That is
a little awkward but consistent in each layer.

**Accessibility gaps.** Title updates help. Character count is a hint, not a
live region. We have not tested with a full assistive-technology set.

**Would I merge this?** Yes for a take-home prototype, with the limits above
written down. I would not ship it to the public internet without rate
limiting, a real secret, and `DEBUG` off.

## Future improvements

The current classifier is a small, deterministic phrase list. That is simple,
transparent, and suitable for this prototype. If real user language showed
that this approach is too limited, a more capable classification method could
be evaluated later. It would still route into the same curated topics, fall
back to unknown when unsure, and never generate legal advice.

Other later work that follows from what this slice cannot do yet:

- A short clarification when we cannot match, without guessing
- Periodic checks of curated LEASE URLs (`python manage.py check_guidance_links`,
  also available as a manual GitHub Action)
- Broader assistive-technology testing
- Technical monitoring (counts, timings, error rates, maybe topic slug)
  without logging raw enquiry text, if the service were deployed
