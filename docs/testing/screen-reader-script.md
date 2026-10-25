# Screen reader script (PTR-31)

A manual pass with two screen readers: NVDA with Firefox on Windows, and VoiceOver with Safari on an iPhone. It takes about 45 minutes per reader. Run it on the staging URL after each release candidate, and once on production after launch.

Mark each check **Pass** or **Fail** in the results table at the end. A fail becomes a YouTrack Bug (section 5).

## 1. Set up

### NVDA on Windows

1. Install NVDA from nvaccess.org (free) and open Firefox.
2. Start NVDA with **Ctrl + Alt + N**. Stop speech at any time with **Ctrl**.
3. Keys used below (NVDA reads web pages in "browse mode" until you reach a control):

| Key                   | Does                                               |
| --------------------- | -------------------------------------------------- |
| **H** / **Shift + H** | Next / previous heading                            |
| **1** to **3**        | Next heading at that level                         |
| **D**                 | Next landmark (banner, navigation, main, footer)   |
| **K**                 | Next link                                          |
| **F**                 | Next form field                                    |
| **B**                 | Next button                                        |
| **Tab**               | Next focusable control (switches to focus mode)    |
| **Insert + F7**       | List of headings, links, and landmarks on the page |
| **Insert + Down**     | Read from here to the end                          |

### VoiceOver on iPhone

1. Settings > Accessibility > VoiceOver > On. Set **Accessibility Shortcut** to VoiceOver so a triple-click of the side button toggles it.
2. Open Safari.
3. Gestures used below:

| Gesture                                | Does                                             |
| -------------------------------------- | ------------------------------------------------ |
| Swipe right / left (one finger)        | Next / previous item                             |
| Double-tap                             | Activate the selected item                       |
| Two-finger rotate (the rotor)          | Choose Headings, Landmarks, Links, Form Controls |
| Swipe down / up (after choosing rotor) | Next / previous item of that kind                |
| Two-finger swipe up                    | Read the whole page from the top                 |
| Two-finger tap                         | Stop speech                                      |

## 2. Every page

Run these on every page: home, work, one case study, experience, about, contact, privacy, and the 404 page (any made-up address).

| #   | Do                                                           | Expect to hear                                                                                                                                                    |
| --- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1  | Load the page                                                | The page title, ending "Pierce Rogg" (home is just "Pierce Rogg")                                                                                                 |
| P2  | NVDA: **Tab** once. iOS: swipe right once                    | "Skip to content, link". Activating it moves to the main content                                                                                                  |
| P3  | NVDA: **D** repeatedly. iOS: rotor Landmarks                 | Banner, navigation "Primary" (desktop), main, content info (footer). Pages may add named ones, such as "Breadcrumb" or "Key figures"; none is unnamed or repeated |
| P4  | NVDA: **Insert + F7**, Headings. iOS: rotor Headings         | Exactly one heading level 1, then level 2s in reading order. No empty or skipped levels                                                                           |
| P5  | Move through the header links (desktop; phones use M1 to M4) | "pierce.rogg, home, link", then work, experience, about, contact. The current page says "current page"                                                            |
| P6  | Move through the footer links                                | linkedin and github each say "opens in a new tab"                                                                                                                 |

## 3. Page checks

### Home

| #   | Do                                                                                                | Expect to hear                                                                           |
| --- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| H1  | Reach the diagram next to the hero                                                                | "Network topology: an edge firewall linked to ..." read once as an image, no node labels |
| H2  | Reach the decorative dots in the terminal window                                                  | Nothing. They are hidden from screen readers                                             |
| H3  | Move to the terminal tabs                                                                         | "Terminal views, tab list", then "~/infrastructure, tab, selected, 1 of 3"               |
| H4  | NVDA: **Tab** to the selected tab, then **Right Arrow**. iOS: swipe to "~/operations", double-tap | "~/operations, tab, selected, 2 of 3", and the panel below now reads $150K, -25%, NIST   |
| H5  | NVDA: **End**, then **Home**                                                                      | Jumps to "~/leadership", then back to "~/infrastructure"                                 |
| H6  | Read the operations panel                                                                         | Each figure reads as a term then its description, and ends with its "src:" line          |
| H7  | Reach the featured case study cards                                                               | Each card is one link that reads its ID, discipline, title, and summary                  |

### Work

| #   | Do                             | Expect to hear                                                       |
| --- | ------------------------------ | -------------------------------------------------------------------- |
| W1  | Reach the filter               | "Filter by discipline, group", then "all, toggle button, pressed"    |
| W2  | Activate "documentation"       | "pressed", then shortly after "1 of 3 case studies in Documentation" |
| W3  | Activate "documentation" again | Filter clears; "3 case studies" is announced                         |
| W4  | Move through a card            | One link per card (the title), not several links for one card        |

### Case study (open BDOS v3)

| #   | Do                        | Expect to hear                                                              |
| --- | ------------------------- | --------------------------------------------------------------------------- |
| C1  | Reach the breadcrumb      | "Breadcrumb, navigation", "~/work, link", then the slug as the current page |
| C2  | Reach the figures strip   | "Key figures, region", each value read with its label                       |
| C3  | Reach the exhibit tree    | A region named after its caption; NVDA can **Tab** into it                  |
| C4  | Reach "More case studies" | A navigation with two links, previous and next                              |

### Experience

| #   | Do                                       | Expect to hear                                                        |
| --- | ---------------------------------------- | --------------------------------------------------------------------- |
| E1  | Reach the role history                   | "list, 6 items", then roles newest first, each with a level 3 heading |
| E2  | Read a role's dates                      | "2025 to present", "2023 to 2025", read as plain years                |
| E3  | Reach "Download resume" (top and bottom) | Two links, each "Download resume"                                     |

### About

| #   | Do                       | Expect to hear                                              |
| --- | ------------------------ | ----------------------------------------------------------- |
| A1  | Read the story           | Your two paragraphs, then the four principles paragraph     |
| A2  | Reach the education card | "M.S. Computer Information Systems", "in progress", no date |

### Contact

Each successful send emails your inbox and counts toward the limit of 5 messages per hour from one connection. Use one real send at most per run.

| #   | Do                                                         | Expect to hear                                                                                        |
| --- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| F1  | NVDA: **F** through the fields. iOS: rotor Form Controls   | "Name, edit", "Work email, edit", "Reason, combo box, Interview or role", "Message, edit, multi-line" |
| F2  | Confirm no hidden field                                    | No "Website" field is announced anywhere                                                              |
| F3  | Type "jordan@" in Work email, then move to the next field  | Back on Work email: "invalid entry" and "Enter an address like name@company.com"                      |
| F4  | Fix the email and leave the field                          | "format looks right"                                                                                  |
| F5  | Reload, then activate "Send message" with everything empty | Focus lands on Name, announced as invalid with "Enter your name."                                     |
| F6  | Open `/contact?reason=consulting`                          | Reason reads "Consulting engagement"                                                                  |
| F7  | Fill the form correctly and send (once)                    | "message sent" is announced, followed by the thank-you line                                           |
| F8  | Reach linkedin and github links on the left                | Each says "opens in a new tab"                                                                        |

### Privacy and 404

| #   | Do                                | Expect to hear                                                               |
| --- | --------------------------------- | ---------------------------------------------------------------------------- |
| R1  | Read the privacy page by headings | The contact form, Analytics, Cookies, Hosting, Questions about your message  |
| R2  | Open a made-up address            | Heading level 1 "404: route not found", then links ~/home, ~/work, ~/contact |

### Phone only (VoiceOver)

| #   | Do                          | Expect to hear                                                                                                                                  |
| --- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| M1  | Reach the menu button       | "Open menu, button, collapsed"                                                                                                                  |
| M2  | Double-tap it               | Becomes "Close menu, expanded"; the next swipe lands on the first menu link                                                                     |
| M3  | Swipe through the open menu | Each page link, then "Download resume (PDF)". The menu is not a dialog, so swiping past the last item continues into the page; that is expected |
| M4  | Double-tap a link           | The new page loads and the menu is closed                                                                                                       |

## 4. Results

Copy this table into a comment on PTR-31 and fill it in.

| Check    | NVDA + Firefox | VoiceOver + Safari | Notes |
| -------- | -------------- | ------------------ | ----- |
| P1 to P6 |                |                    |       |
| H1 to H7 |                |                    |       |
| W1 to W4 |                |                    |       |
| C1 to C4 |                |                    |       |
| E1 to E3 |                |                    |       |
| A1 to A2 |                |                    |       |
| F1 to F8 |                |                    |       |
| R1 to R2 |                |                    |       |
| M1 to M4 | n/a            |                    |       |

## 5. When a check fails

1. Write down the check number, the page, what you heard, and what you expected.
2. Create a **Bug** in YouTrack project PTR, linked to PTR-31, with that detail in the description.
3. Set **Severity**:
   - **Critical:** a page or the contact form cannot be used with a screen reader.
   - **High:** information is missing or wrong (an unlabeled control, a figure read without its label).
   - **Medium:** confusing but usable (extra or repeated announcements).
   - **Low:** wording only.

Critical and High block launch. Exact wording varies a little between NVDA, VoiceOver, and their versions. A different phrase with the same meaning is a pass.
