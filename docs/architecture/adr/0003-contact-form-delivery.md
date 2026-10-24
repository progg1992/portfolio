# ADR 0003: Contact form via server action and a transactional email API

- **Status:** Accepted. Client chose Resend on 2026-10-23.
- **Date:** 2026-10-19
- **Issue:** PTR-27

## Context

The form must validate on the server, resist spam, deliver to the Client's inbox, and store nothing (ADR 0002). It runs on Vercel, so outbound SMTP from a function is unreliable; an HTTPS email API is the standard route.

## Decision

- A Next.js server action receives the form, re-validates every field with the same schema the client uses, checks a honeypot field, and enforces 5 submissions per IP per hour.
- Delivery goes through Resend's HTTPS API: the free tier covers this volume, the API is simple, and the sending domain is verified through DNS.
- Rejected: Zoho ZeptoMail. It would keep business email and transactional email with one vendor, but the Client preferred Resend.
- The API key and the destination address live only in Vercel environment variables.
- Rate limit, decided in PTR-27: two layers. The server action keeps an in-memory sliding window of 5 per IP per hour, which is exact on one instance and a speed bump across many. The edge layer is a Vercel Firewall rate rule on `POST /contact`: 5 per 10 minutes per IP, because 10 minutes is the longest window Vercel offers below Enterprise and Hobby allows one such rule (Vercel WAF rate limiting docs, checked 2026-10-24). Together they stop floods at the edge and hold steady senders to roughly 5 an hour; neither alone is an exact global count. This avoids a key-value store, which would be the only stateful service on the site (ADR 0002).
- The browser and the server share one set of plain validation functions (`src/lib/contact/validate.ts`), so the rules cannot drift and the client bundle carries no schema library.
- A honeypot field catches simple bots; a filled honeypot gets a normal success response so the bot learns nothing.

## Consequences

- One third-party dependency on the critical path for the form, with a visible failure state.
- Sending from the Client's own domain requires SPF and DKIM records at the DNS host (PTR-10).
