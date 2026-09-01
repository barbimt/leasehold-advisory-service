# Quality notes and self review

This document explains the main quality decisions in the prototype, the current limitations, and how I would improve the service if it needed to support more users, more content, and more complex enquiries.

## Personal data and security

The browser sends a selected situation and/or free text to `POST /api/triage/`.

The enquiry is processed for that request but isn't stored. The current flow doesn't need user accounts, contact details, or an enquiry database.

Users can still type personal information into the free-text field, so the form asks them not to include unnecessary personal details.

The API is public because the triage service doesn't require authentication. The backend validates the request, limits the free-text input, and rejects unexpected fields.

For a larger public service, I would also add rate limiting, abuse protection, and monitoring for unusual traffic. I wouldn't log raw enquiry text unless there was a clear product need and the privacy impact had been reviewed.

## Accessibility

Accessibility was considered as part of the implementation rather than added at the end.

The form uses native HTML controls, labels, `fieldset` and `legend`, clear validation errors, keyboard navigation, and explicit focus management after errors and result changes.

Automated checks include `jsx-a11y` and axe-core tests. Manual checks covered keyboard navigation, accessible names and descriptions, focus behaviour, contrast, and layout reflow.

The implementation was designed with WCAG 2.2 AA principles in mind, but automated tools alone can't prove compliance.

For a production service, I would use a wider accessibility test matrix:

- VoiceOver with Safari
- NVDA with Chrome or Firefox
- mobile VoiceOver and TalkBack
- keyboard-only journeys
- 200% and 400% zoom and reflow
- Lighthouse and axe as supporting automated checks
- manual testing against WCAG 2.2 AA

For an important public service, I would also consider an independent accessibility audit and user testing with people who use assistive technologies.

## Key technical decisions

### Keep the first user journey focused

The application has one main goal: understand the user's situation and guide them to a useful next step.

It doesn't try to provide personalised legal advice.

Keeping the journey small makes the behaviour easier to understand, test, and maintain.

### Use controlled classification

When a user writes something in the textarea, the React frontend sends that text to the Django API.

The backend normalises the text and checks it against a small set of controlled words and phrases linked to each topic.

For example, wording related to leaks, repairs, or maintenance can route the enquiry to the Repairs topic.

If the text clearly matches one topic, the API returns that topic together with the guidance already linked to it.

If the text matches more than one topic, or doesn't match anything clearly, the API returns `unknown` instead of guessing.

This approach is simple, predictable, and easy to test.

For this type of service, a safe fallback is more useful than confidently sending someone to the wrong information.

### Keep guidance controlled by the backend

The backend owns the topic information, next steps, and links to official guidance.

Once the classifier selects a topic, Django returns the guidance linked to that topic.

The React frontend is responsible for presenting the result clearly, but it doesn't decide what legal content should be shown and it doesn't generate legal advice.

This keeps a clear boundary between classification, content, and presentation.

### Keep state close to the feature

The form and result belong to one short user journey, so the state stays close to the components that use it.

There isn't a need for a global client-side store in the current version.

### Start with semantic HTML

Radios, textarea, labels, buttons, `fieldset` and `legend` provide the main accessibility behaviour.

ARIA is only used where native HTML isn't enough.

### Use GOV.UK patterns as a reference

The GOV.UK Design System was useful as a reference for public-service patterns such as error summaries, hints, focus management, and clear form structure.

We didn't add the full GOV.UK Frontend package because the service has its own visual identity and this flow only needs a small number of simple components.

The goal was to use the useful interaction and accessibility patterns without copying another service's visual system.

### Keep the API boundary simple

The React frontend sends requests to the Django API through `POST /api/triage/`.

During local development, Vite proxies `/api` requests to Django.

For the deployed version, the API origin is configured through `VITE_API_BASE_URL`, so the backend URL isn't hard-coded into the frontend source.

This keeps local development simple while still allowing the frontend and API to be hosted separately.

### Don't store enquiries when the feature doesn't need them

The triage flow is stateless.

The backend receives the enquiry, classifies it, returns a response, and doesn't persist the user's text.

A product database isn't required for the current feature.

## Self review

### Strengths

The feature is small and easy to follow.

Client-side and server-side validation cover the main input rules.

The frontend handles:

- validation
- loading
- API failures
- known results
- unknown results
- changing answers
- starting again

The backend has a clear API contract and keeps classification and guidance data outside the UI.

The service doesn't store enquiry text and doesn't generate legal advice.

Tests cover the main classifier behaviour, API contract, error cases, and frontend interactions.

The frontend and backend are separated clearly, while the overall architecture stays simple enough for a small team to maintain.

### Engineering quality

The repository includes automated checks for both the frontend and backend so regressions are easier to catch and quality stays consistent.

The frontend uses linting, formatting checks, TypeScript type checking, automated tests, accessibility checks, and a production build check.

The backend uses Ruff for linting and formatting, pytest for automated tests, and Django's system checks.

GitHub Actions runs the main frontend and backend quality checks on pushes and pull requests.

The guidance-link check is kept as a separate manual workflow because it depends on an external website and shouldn't make normal CI unreliable.

### Current limitations

The classifier only understands wording covered by the current rules.

Real users may describe the same problem in many different ways, so some valid enquiries may still end in `unknown`.

The current `unknown` result is safe, but it could offer a better clarification journey.

Guidance content is currently defined in code. That works for a small number of topics, but it would become harder to maintain if content changed often or more teams needed to manage it.

The accessibility work covers the main journey, but a production service would need broader testing with real assistive technologies and users.

The public API would also need stronger operational controls if traffic increased.

The current automated tests cover the frontend and backend separately, but there isn't yet a browser-level end-to-end test that exercises the complete journey against the running API.

## Future improvements

### 1. Learn from real user journeys

Before making the classifier more complex, I would measure where the current approach is failing.

Useful signals could include:

- percentage of enquiries that return `unknown`
- topics that users often change after seeing a result
- situations where users restart the journey
- API errors
- frontend errors
- common points where users leave the flow

These signals can help improve the service without storing raw enquiry text.

The goal would be to improve based on real behaviour rather than guessing what users might need.

### 2. Improve classification and clarification

I would first measure where the current deterministic classifier fails, using the journey signals above.

If that showed the phrase list was too limited, I would consider a semantic classifier or a bounded LLM. It would only map an enquiry onto the existing controlled topics. It wouldn't generate legal advice.

The boundary would stay:

`user enquiry → controlled topic → curated guidance`

A later classifier could also return a confidence level:

- high confidence → show the result
- medium confidence → ask one short clarification question
- low confidence → use the safe fallback

A clarification could be something simple such as:

> Is your question about a repair that hasn't been completed, or planned major works?

That would improve routing without pretending the system understands more than it does.

### 3. Move guidance into a CMS and improve content governance

The current guidance is small enough to keep in code.

If topics and content grew, Wagtail would be a sensible CMS. Content and legal teams could update titles, summaries, next steps, links, and related resources without a frontend deployment. The Django API response shape should stay the same, so the React app wouldn't need a large rewrite.

Content governance should cover broken-link checks, ownership, review dates, outdated guidance, and content that needs legal review. The existing manual guidance-link check can stay part of that process.

### 4. Add observability and reliability

I would monitor both technical health and the quality of the user journey.

Useful signals could include:

- API response times
- failed requests
- percentage of `unknown` results
- topic distribution
- frontend errors
- broken guidance links
- unusual traffic patterns

A sudden rise in `unknown` results could show that people are describing problems in ways the classifier doesn't understand. A rise in failed requests could point to an API or hosting problem.

I wouldn't log raw enquiry text just for analytics.

As usage grows, I would also set basic service expectations:

- expected response times
- acceptable failure rates
- availability targets
- alerts when the service is unhealthy

That would make reliability something the team can measure, rather than only reacting when someone reports a problem.

### 5. Strengthen accessibility testing

Accessibility testing should become part of the regular release process.

I would add structured testing with:

- VoiceOver and Safari
- NVDA and Chrome or Firefox
- TalkBack on Android
- VoiceOver on iOS
- keyboard-only journeys
- Lighthouse and axe
- manual WCAG 2.2 AA reviews

For a public-facing service, I would also include usability testing with people who use assistive technologies.

### 6. Add end-to-end testing

The current tests already cover classifier behaviour, the API contract, frontend interactions, and accessibility behaviour. They don't yet verify the complete browser → frontend → API journey.

A small E2E suite would be useful for a few critical journeys:

- selecting a situation and seeing the expected guidance
- submitting a free-text enquiry
- receiving the safe `unknown` fallback
- handling an API failure
- changing answers or starting again

That suite should stay small and focused on those journeys, rather than repeating the unit and integration tests.

Playwright would be a sensible option later. It isn't part of the project today. Those tests could also run in CI once a reliable test environment is available.

### 7. Harden the public API as usage grows

The API is intentionally public because users don't need an account to use the triage service.

If traffic increased, I would add:

- rate limiting
- abuse protection
- request and error monitoring
- alerts for unusual traffic or failure rates

These controls should protect the service without requiring the application to store the content of users' enquiries.

### 8. Add persistent infrastructure when the product needs it

The current triage feature doesn't persist enquiries, so PostgreSQL isn't needed today.

If later work needed persistent content, history or audit data, user preferences, or other operational data, PostgreSQL would be a suitable production database. Docker could then help developers run those supporting services in a reproducible local environment.

Neither should be added until the product has a real need.
