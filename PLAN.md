**Name:** Barbara
**Date:** 29 August 2026

# Problem restatement

The Leasehold Advisory Service helps people navigate complex legal situations.
This first version is for leaseholders in England and Wales who arrive with a
leasehold question. They are often stressed, may not know legal terminology, and
need a clear next step rather than a wall of legal text.

The prototype should help someone describe their situation, identify the most
relevant topic, and receive a clearer next step in plain English. They can
choose a common situation or write in their own words. The application maps that
to a small set of controlled topics and shows relevant guidance.

A useful first version is triage and navigation, not personalised legal advice.
It should not claim to answer an individual case or replace specialist advice.

The first slice is leasehold-only because the proposed categories are
leasehold-specific.

# Assumptions and scope

- Users may not know legal terminology and may be stressed, so the language
  should stay plain and the path should stay short.
- No authentication is required.
- The first version should avoid collecting unnecessary personal data. Raw
  enquiry text should not be persisted unless there is a clear need.
- Classification will initially be deterministic (chosen situation and/or
  keyword matching), not LLM-based.
- LEASE also supports park homeowners, but park-home enquiries are outside this
  initial slice.

Intentionally outside this slice: a full legal advice engine, authentication,
Wagtail or CMS integration, LLM classification, and production deployment.

# First vertical slice

The smallest useful flow:

1. The user chooses a common situation or describes their situation in free
   text.
2. The application validates the input.
3. The backend maps it to a small controlled advice category.
4. The user receives a plain-English next step and relevant guidance.
5. If the application cannot categorise confidently, it provides a safe
   fallback rather than guessing.

Initial categories:

- Service charges
- Major works / Section 20
- Repairs
- Lease extension
- Disputes
- Unknown / not sure

# Ordered task breakdown

1. **Define controlled categories and guidance data**  
   Done means: each category has a short label, a plain-English next step, and
   controlled, curated guidance the UI can show, not generated legal advice.

2. **Add the Django triage endpoint**  
   Done means: a request with a chosen situation and/or description returns a
   category and guidance, or a validation error, with no database write of the
   enquiry text.

3. **Build the accessible React enquiry form**  
   Done means: a user can choose a common situation or enter free text, with
   labels, errors, and keyboard access that support WCAG 2.2 AA.

4. **Connect the frontend to the backend**  
   Done means: a valid form submission sends the payload to the triage endpoint
   and the UI can handle a successful response.

5. **Show the next-step result**  
   Done means: after triage, the user sees the matched topic, a plain-English
   next step, and a reminder that this is navigation, not legal advice.

6. **Add fallback/error behaviour**  
   Done means: unclear input uses Unknown / not sure without guessing, and
   validation or server failures are explained without a false category.

7. **Add important tests**  
   Done means: tests cover mapping to each initial category, the unknown
   fallback, invalid input, and important frontend interaction and API
   behaviour.

8. **Harden accessibility, privacy and robustness**  
   Done means: a focused pass has improved accessibility, copy, validation, and
   privacy handling without expanding the product scope.

# Risks

A reviewer should scrutinise:

- accessibility against WCAG 2.2 AA
- incorrect or misleading classification
- accidentally presenting routing as legal advice
- personal data that a user might type into free text
- security around untrusted free-text input, logging, and configuration
- server-side validation and error handling
- testing gaps
- unnecessary complexity
