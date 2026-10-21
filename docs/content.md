# Adding or editing a case study

Each case study is one file in `src/content/work/`. The site builds the `/work` index, the case study page, and the home page teaser from that file. No component code changes.

## Add one

1. Copy `src/content/work/_template.mdx` to `src/content/work/<slug>.mdx`. The file name must match the `slug` inside it.
2. Fill in every field in `meta`. The template comments list the allowed values.
3. Write any longer sections below the `meta` block in Markdown.
4. Set `published: true` when it is ready to go live.
5. Run `npm run build`. If anything is wrong, the build stops and names the file and the field.
6. Open a pull request into `staging` and check the case study on the preview.

## Fields

| Field                           | Rule                                                             |
| ------------------------------- | ---------------------------------------------------------------- |
| `id`                            | `CS-` plus two digits, unique                                    |
| `slug`                          | lowercase words joined by hyphens, unique, same as the file name |
| `title`                         | 90 characters or fewer                                           |
| `subheading`                    | 120 characters or fewer                                          |
| `summary`                       | one line for cards and the home page, 160 characters or fewer    |
| `discipline`                    | `infrastructure`, `operations`, `delivery`, or `documentation`   |
| `stack`                         | 1 to 6 short labels                                              |
| `context`                       | employer or project, and years, as shown on the page             |
| `problem`, `solution`, `impact` | the three-part grid on the page                                  |
| `metrics`                       | up to 4. Each needs `value`, `label`, and `source`               |
| `exhibit`                       | `model-tree`, `incident-timeline`, `metric-tiles`, or `none`     |
| `order`                         | display order, unique positive whole number                      |
| `featured`                      | `true` to show on the home page                                  |
| `published`                     | `false` hides it everywhere without deleting it                  |

## The sourcing rule

Every metric must have a `source`: the employer or project and the years. A metric without one fails the build. The figure must also match the resume. This is content requirement CNT-01, and it is enforced in code so that an unsourced number can never reach the live site.

## Hide or remove one

Set `published: false` to hide it. Delete the file to remove it for good; its URL will then return 404.
