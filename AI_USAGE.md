# AI usage

AI-assisted tools were used while building this prototype. They were not used
to generate legal guidance, and they are not part of the running app.

The tools were used mainly to:

- validate technical decisions
- review edge cases
- check accessibility and robustness concerns
- compare approaches against current documentation

Suggestions were reviewed before they were adopted. Behaviour was checked
with automated tests and by using the form in the browser.

Classification is a small, deterministic phrase list on the server. It does
not call an AI model at runtime.
