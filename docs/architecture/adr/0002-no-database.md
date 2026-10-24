# ADR 0002: No database; form submissions are emailed

- **Status:** Accepted
- **Date:** 2026-10-19
- **Issue:** SOW section 2

## Context

The only data the site receives is contact form messages, a few per week at most. A database would add hosting cost, backups, access control, a privacy obligation for stored personal data, and another thing to patch.

## Decision

Do not store submissions. The server action validates each message and sends it by email to the Client's inbox. The email provider's delivery log is the only record outside the inbox.

## Consequences

- No personal data at rest on infrastructure this project controls, which keeps the privacy page short and true.
- If the email provider fails, the message is lost unless the visitor retries. The form shows a failure state with the LinkedIn link as a fallback (PTR-27).
- Reporting on submissions comes from cookieless analytics events, not from stored records.
