# Definition of Ready and Definition of Done

These apply to every story and task in YouTrack project PTR.

## Definition of Ready

A story can enter a sprint when all of these hold:

- [ ] Written as a user story or a task with a clear outcome
- [ ] Checkable acceptance criteria on the issue
- [ ] Estimated in story points (1, 2, 3, 5, or 8). An 8 is split first.
- [ ] Traced to a requirement in the requirements specification, or to an approved change request
- [ ] Dependencies are done or scheduled earlier in the same sprint
- [ ] Any content or figures it needs have been supplied by the Client and sourced
- [ ] Design exists on the canvas, if the story has a visible surface

## Definition of Done

A story is done when all of these hold:

- [ ] Every acceptance criterion is met **on the Vercel preview**, not only locally
- [ ] CI is green: lint, typecheck, format, unit tests, build, accessibility, and Lighthouse budgets
- [ ] Checked by hand at 375, 768, and 1440 px, and with the keyboard if interactive
- [ ] Figures in the copy have a source and match the resume
- [ ] Docs updated where behavior, architecture, or operations changed (ADR, design spec, runbook)
- [ ] No secrets, private contact details, or commercial terms in the diff
- [ ] Pull request reviewed against this list and merged to `staging`
- [ ] Verified on staging (YouTrack state: Validation)
- [ ] Accepted by the product owner (Acceptance Status: Accepted), at least 24 hours after it was finished
- [ ] Time logged on the issue

The 24-hour gap applies because one person holds every role on this engagement (risk PTR-43). Acceptance is a fresh look, not a continuation of the build session.
