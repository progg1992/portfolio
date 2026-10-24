# ADR 0003: Contact form via server action and a transactional email API

- **Status:** Proposed. Needs Client decision on the provider before PTR-27 starts.
- **Date:** 2026-10-19
- **Issue:** PTR-27

## Context

The form must validate on the server, resist spam, deliver to the Client's inbox, and store nothing (ADR 0002). It runs on Vercel, so outbound SMTP from a function is unreliable; an HTTPS email API is the standard route.

## Decision (proposed)

- A Next.js server action receives the form, re-validates every field with the same schema the client uses, checks a honeypot field, and enforces 5 submissions per IP per hour.
- Delivery goes through a transactional email API over HTTPS. The candidate is Resend (free tier covers this volume, simple API, domain verification through DNS). The Client already uses Zoho Mail for business email, so Zoho's transactional service (ZeptoMail) is the alternative if the Client prefers one vendor.
- The API key and the destination address live only in Vercel environment variables.
- The rate limit needs shared state across function instances. Options, cheapest first: Vercel's built-in firewall rate limiting on the action's path, or a small key-value store. Decide during PTR-27 after checking current Vercel plan limits.

## Consequences

- One third-party dependency on the critical path for the form, with a visible failure state.
- Sending from the Client's own domain requires SPF and DKIM records at the DNS host (PTR-10).
