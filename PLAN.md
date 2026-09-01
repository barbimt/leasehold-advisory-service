**Name:** Barbara Torres
**Date:** 29 August 2026

# Problem restatement

The Leasehold Advisory Service helps people navigate complex legal situations.

This first version is for leaseholders in England and Wales who arrive with a leasehold question. They may be stressed, may not know legal terminology, and need a clear next step rather than a wall of legal text.

The prototype should help someone describe their situation, identify the most relevant topic, and receive a clearer next step in plain English.

They can choose a common situation or describe the problem in their own words. The application maps that input to a small set of controlled topics and shows relevant guidance.

A useful first version is focused on triage and navigation, not personalised legal advice. It shouldn't try to answer an individual legal case or replace specialist advice.

The first slice is leasehold-only because the proposed categories are specific to leasehold enquiries.

# Assumptions and scope

- Users may not know legal terminology and may be stressed, so the language should stay plain and the journey should stay short.
- No authentication is required for the first version.
- The service should avoid collecting unnecessary personal data.
- Enquiry text is only needed to classify the current request and shouldn't be stored.
- A safe fallback is better than guessing when the service can't identify one clear topic.
- Park-home enquiries are outside this first slice.

Intentionally outside this slice:

- personalised legal advice
- user accounts
- storing enquiries
- a full content-management workflow
- production-ready infrastructure
- full feature coverage for every type of enquiry

# First vertical slice

The smallest useful flow:

1. The user chooses a common situation or describes their situation in free text.
2. The application validates the input.
3. The backend maps the enquiry to a small controlled advice category.
4. The user receives a plain-English next step and relevant guidance.
5. If the application can't categorise the enquiry clearly, it provides a safe fallback instead of guessing.

Initial categories:

- Service charges
- Major works / Section 20
- Repairs
- Lease extension
- Disputes
- Unknown / not sure

# Ordered task breakdown

1. **Define controlled categories and guidance data**  
   Done means: each category has a short label, a plain-English next step, and controlled guidance that the UI can show.

2. **Add the Django triage endpoint**  
   Done means: a request with a chosen situation and/or description returns a category and guidance, or a validation error, without storing the enquiry text.

3. **Build the accessible React enquiry form**  
   Done means: a user can choose a common situation or enter free text using clear labels, errors, keyboard navigation, and semantic HTML.

4. **Connect the frontend to the backend**  
   Done means: a valid form submission sends the payload to the triage endpoint and the UI handles the response correctly.

5. **Show the next-step result**  
   Done means: after triage, the user sees the matched topic, a plain-English next step, and relevant guidance.

6. **Add fallback and error behaviour**  
   Done means: unclear input uses the safe unknown state, while validation and server failures are explained without showing a false category.

7. **Add important tests**  
   Done means: tests cover the initial categories, unknown fallback, invalid input, API behaviour, and the main frontend interactions.

8. **Harden accessibility, privacy and robustness**  
   Done means: a focused review improves accessibility, copy, validation, error handling, and privacy without expanding the product scope.

# Risks

A reviewer should scrutinise:

- accessibility and keyboard usability
- incorrect or misleading classification
- presenting routing as if it were legal advice
- personal information entered into the free-text field
- server-side validation and handling of untrusted input
- API and error handling
- important testing gaps
- unnecessary complexity
