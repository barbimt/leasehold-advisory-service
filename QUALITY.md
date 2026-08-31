# Quality notes and self review

This is the Part 3 review for the take-home. It covers data, accessibility,
the main technical choices, what I would challenge in a code review, and what
I would do next.

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

**Checks.** ESLint `jsx-a11y`, axe-core in Vitest (load, invalid submit,
known result, unknown result), plus a manual keyboard pass, zoom/reflow, a
contrast spot-check, and a VoiceOver spot-check.

**What we improved in this pass.** Clearer privacy and situation copy. Service
errors no longer say “check your answers”. The document title updates on the
result. `aria-invalid` is no longer on the fieldset.

**Character count.** The remaining count stays as a hint linked with
`aria-describedby`. We did not add a live region that updates on every
keystroke. GOV.UK’s character count announces after the user stops typing, to
avoid noisy screen-reader updates. Our limit is 2000 characters, so most
people never get close. If the limit were much lower, I would look at delayed
or threshold announcements, not per-keystroke live regions.

**What we would do next.** Broader assistive-technology testing (for example
NVDA, JAWS, and mobile). The footer “Accessibility statement” and “Privacy”
links go to lease-advice.org. They describe LEASE’s live site, not this
prototype.

This work aims at WCAG 2.2 AA. Axe passing is not a claim that the prototype
meets AA.

## Key technical decisions

**Local React state, not Redux or Zustand.** One form owns the journey. A
global store would add moving parts with no extra screens that share data.

**No React Router.** The result lives in memory after POST. A URL cannot
rebuild it without storing or replaying the enquiry. Extra routes would
suggest bookmarkable results we do not have.

**Native `fetch`, not Axios or TanStack Query.** One POST, one response, a
few error kinds. A query library would be unused weight.

**Relative `/api` plus the Vite proxy.** Locally the browser talks to the
Vite origin. We did not hard-code Django’s URL or add CORS. Trade-off:
`vite preview` and a split deploy would need a gateway or CORS later.

**Tailwind for the visual layer.** Layout stays in the components. We do not
ship a GOV.UK CSS kit.

**Native semantic controls.** Radios, textarea, buttons, labels, and a
fieldset. Accessibility starts with HTML, not ARIA on generic divs.

**GOV.UK Design System as guidance, GOV.UK Frontend not added.** We wanted
clear errors, focus, and inset-style notices. We do not ship GDS branding or
a large Sass stack that is not LEASE’s.

**Deterministic classifier, not fuzzy matching or an LLM.** The phrase list
is small, visible in code, and easy to test. It will miss wording we did not
list. That is accepted for this slice.

**Backend owns controlled guidance.** The API returns curated titles,
summaries, and LEASE URLs. The UI does not invent links or advice.

**Unknown is a valid outcome.** If we are not sure, we do not guess a topic.
That is safer than a wrong next step.

**No Wagtail and no enquiry database.** Editors do not need a CMS in this
slice, and we chose not to keep enquiry text. Postgres and Docker had no
product job, so they are gone.

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
live region. We have not tested with a full AT matrix.

**Would I merge this?** Yes for a take-home prototype, with the limits above
written down. I would not ship it to the public internet without rate
limiting, a real secret, and `DEBUG` off.

## Future improvements

The main classifier limit is not “a few missing synonyms”. The phrase list is
simple, transparent, and testable. As vocabulary and topics grow, every new
wording becomes another string to maintain, and two topics in one sentence
still collapse to unknown.

If matching needed to get better, I would do it in stages:

1. Stronger text normalisation (punctuation is in this pass; then things like
   quotes and hyphens), without changing the matching model.
2. Lemmatisation or concept-based deterministic matching. Still a controlled
   map. Still unknown when more than one topic matches.
3. Semantic or embedding-based classification into the same controlled slugs.
4. Bounded AI-assisted classification. A model may only choose from the LEASE
   topic list. It must use confidence thresholds, fall back to unknown or a
   short clarification when unsure, and never generate legal advice.

Any probabilistic or AI-assisted approach stays a router into curated
guidance, not an advice engine.

Other later work that would earn its place:

- Wagtail, if editors need to change guidance copy and URLs without a code
  change
- Checks for broken LEASE guidance URLs
- A short clarification when we cannot match, without guessing
- Broader screen-reader and assistive-technology testing
- Technical monitoring (counts, timings, error rates, maybe topic slug)
  without logging raw enquiry text
