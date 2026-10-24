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
- [ ] `/robots.txt` and `/sitemap.xml` reflect production

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

After changing a variable, redeploy the affected environment; Vercel does not apply it to existing deployments.

## Secrets exposure

If a secret is ever committed or exposed:

1. **Rotate it first** at the provider. Rewriting Git history does not remove it from existing clones or forks.
2. Update the value in Vercel and redeploy.
3. Remove it from the repository and, if needed, its history.
4. Record what happened against risk PTR-42.

## Domain (set up in PTR-36)

DNS records, the registrar, and email authentication records (SPF and DKIM for the contact form sender) are documented here when the domain is connected.
