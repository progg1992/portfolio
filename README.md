# pierce.rogg

The portfolio site of Pierce Rogg: technical project manager, principal technologist, and systems operations leader.

This site is built in the open as a four-sprint Scrum engagement, run by [Blue Devil Development](https://bluedevildev.com) as if for an outside client. The code, the process documents, and the decisions behind them are all here.

## Stack

| Layer     | Choice                                                   | Why                                               |
| --------- | -------------------------------------------------------- | ------------------------------------------------- |
| Framework | Next.js 16.4 (App Router), React 19.3, TypeScript strict | Static by default, one server action for the form |
| Styling   | Tailwind CSS 4, tokens in `src/app/globals.css`          | One source for color and type                     |
| Fonts     | Geist and JetBrains Mono, self-hosted                    | No third-party requests at build or run time      |
| Content   | MDX case studies with validated frontmatter              | Add a case study by adding a file                 |
| Hosting   | Vercel, preview per pull request                         | Zero servers to maintain                          |
| Tracking  | YouTrack project PTR                                     | Sprints, acceptance, risks, change requests       |

## Run it locally

Requires Node 22 (see `.nvmrc`).

```bash
npm ci
cp .env.example .env.local   # fill in values for the contact form if you need it
npm run dev                  # http://localhost:3000
```

## Checks

Every pull request must pass these, locally and in CI:

```bash
npm run lint          # ESLint, zero warnings, includes jsx-a11y
npm run typecheck     # tsc --noEmit
npm run format:check  # Prettier
npm test              # Vitest
npm run build         # production build; every route must prerender
```

CI also runs an axe accessibility scan and Lighthouse budgets against the build. See `docs/testing/test-plan.md`.

## Branches

- `main` is production. It only changes through a release pull request from `staging`.
- `staging` is the integration branch and the default branch for pull requests.
- Feature branches are cut from `staging` and named `feature/PTR-<id>-<slug>`.

## Documentation

| Folder              | Holds                                              |
| ------------------- | -------------------------------------------------- |
| `docs/architecture` | Overview and architecture decision records         |
| `docs/design`       | Tokens, components and states, breakpoints, motion |
| `docs/testing`      | Test plan                                          |
| `docs/operations`   | Deployment and rollback runbook                    |
| `docs/process`      | Definition of Ready and Definition of Done         |

## License

Code is MIT (see `LICENSE`). Fonts are under the SIL Open Font License. Site content and the resume are not licensed for reuse.
