# Deployment and rollback runbook

## How code reaches production

1. Cut a branch from `staging`: `feature/PTR-<id>-<slug>`.
2. Open a pull request into `staging`. CI runs; Vercel posts a preview URL.
3. Review against the Definition of Done. The product owner accepts the story on the preview.
4. Merge. Vercel deploys `staging` to the staging URL. Check the change there.
5. To release, open a pull request from `staging` into `main` titled `Release YYYY-MM-DD`, listing the PTR issues it carries.
6. Merge. Vercel deploys `main` to production.
7. Run the smoke test below. Record the release in the YouTrack sprint.

## Smoke test after every production deploy

- [ ] Home, work, one case study, experience, about, and contact load with no console errors
- [ ] Resume downloads and opens
- [ ] Contact form delivers a test message to the inbox
- [ ] `/styleguide` returns 404
- [ ] `/robots.txt` and `/sitemap.xml` reflect production and use the custom domain (`NEXT_PUBLIC_SITE_URL`)
- [ ] Link preview correct in LinkedIn Post Inspector (linkedin.com/post-inspector); after changing the image, inspect again to refresh LinkedIn's cache

## Rollback

Production is a set of immutable Vercel deployments, so rollback is a pointer change, not a rebuild.

1. In Vercel, open the project, then **Deployments**, filtered to Production.
2. Find the last good deployment, open its menu, and choose **Instant Rollback** (or **Promote to Production**).
3. Confirm the smoke test passes.
4. Revert the bad commit on `main` through a pull request, so the next deploy does not reintroduce it, and merge the revert back into `staging`.
5. Open a Bug in YouTrack describing what broke and link the revert.

Target time from noticing a bad deploy to rollback: 10 minutes.

## Environment variables

Set in Vercel, per environment. Names and purpose are listed in `.env.example`; values never appear in the repository.

| Variable                 | Preview         | Staging         | Production      |
| ------------------------ | --------------- | --------------- | --------------- |
| `CONTACT_TO_EMAIL`       | Test inbox      | Test inbox      | Client inbox    |
| `CONTACT_FROM_EMAIL`     | Verified sender | Verified sender | Verified sender |
| `EMAIL_PROVIDER_API_KEY` | Test key        | Test key        | Live key        |
| `NEXT_PUBLIC_SITE_URL`   | Preview URL     | Staging URL     | Custom domain   |

Never set `CONTACT_TRANSPORT` in Vercel. It exists only for the e2e suite, where `test` skips the network; the code ignores it when `VERCEL_ENV` is `production`.

After changing a variable, redeploy the affected environment; Vercel does not apply it to existing deployments.

## Contact form (PTR-27)

Delivery runs through Resend (ADR 0003).

At import (PTR-13), before the first production deploy:

1. **Resend:** create an API key with sending access only, scoped to the sending domain. Put it in `EMAIL_PROVIDER_API_KEY`.
2. **Sender:** verify the sending domain in Resend and add the SPF and DKIM records it lists to DNS (see Domain below). `CONTACT_FROM_EMAIL` must use that domain.
3. **Rate limit:** in Vercel, open **Firewall**, then **Configure**, **New Rule**. Conditions: path equals `/contact` and method equals `POST`. Action: Rate Limit, Fixed Window, 10 minutes, 5 requests, key IP, then Deny. Vercel's longest window on Hobby and Pro is 10 minutes and Hobby allows one rate-limit rule per project, so the edge rule stops floods while the in-app counter enforces 5 per hour per instance. Counters are per region.
4. **Check:** send one message from production and confirm it arrives.

If the form fails in production, the visitor sees the failure message with the LinkedIn link, and the function log shows one of these lines. No message content is ever logged.

| Log line                               | Meaning                                   | Fix                                                 |
| -------------------------------------- | ----------------------------------------- | --------------------------------------------------- |
| `contact: delivery is not configured`  | A variable is missing in this environment | Set all three contact variables and redeploy        |
| `contact: provider returned 401` / 403 | Key revoked or lacks access               | Create a new key in Resend, update Vercel, redeploy |
| `contact: provider returned 422`       | Sender domain not verified                | Finish domain verification in Resend                |
| `contact: provider request failed`     | Network error or 10 s timeout             | Check Resend status; the visitor can retry          |

## Secrets exposure

If a secret is ever committed or exposed:

1. **Rotate it first** at the provider. Rewriting Git history does not remove it from existing clones or forks.
2. Update the value in Vercel and redeploy.
3. Remove it from the repository and, if needed, its history.
4. Record what happened against risk PTR-42.

## Domain (set up in PTR-36)

DNS records, the registrar, and email authentication records (SPF and DKIM for the contact form sender) are documented here when the domain is connected.
