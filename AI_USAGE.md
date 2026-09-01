# AI usage

AI-assisted tools were used while building this prototype.

They were used mainly to:

- draft and refine the implementation plan
- look up current documentation and official sources
- validate technical options and decisions
- review edge cases
- check accessibility and robustness concerns

Suggestions were reviewed before they were adopted.

For example, GOV.UK Frontend was considered after using GOV.UK-style patterns in the early prototype. We decided not to add it because the flow only needed simple native controls, LEASE has its own visual identity, and using the full frontend package would have added styling and JavaScript that the prototype did not need. We still used the GOV.UK Design System documentation as a reference for accessible form, error and focus patterns.

The final behaviour was verified with automated tests and manual browser checks.
