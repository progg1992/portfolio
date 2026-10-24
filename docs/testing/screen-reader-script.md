# Screen reader test script (PTR-31)

Run this once on Windows and once on iPhone, against the **staging URL**, before launch. Allow about 45 minutes per device. Record each step as Pass or Fail in the results table at the end. Log every Fail as a Bug in YouTrack linked to PTR-31, with the page, the step number, and what you heard.

"You should hear" lists the important words, not an exact transcript. Screen readers phrase things differently by version. A step passes when the meaning is there and nothing important is missing, out of order, or read twice.

## Setup

### Windows: NVDA with Firefox

1. Install NVDA from nvaccess.org (free) and the current Firefox.
2. Start NVDA (Ctrl + Alt + N). The **NVDA key** is Insert.
3. Open Firefox and go to the staging URL.

| Action                          | Keys                        |
| ------------------------------- | --------------------------- |
| Stop speaking                   | Ctrl                        |
| Read next item                  | Down Arrow                  |
| Next heading / previous heading | H / Shift + H               |
| Heading list                    | NVDA + F7, then Alt + H     |
| Next landmark                   | D                           |
| Next link / next form field     | K / F                       |
| Move through controls           | Tab / Shift + Tab           |
| Switch to typing in a field     | Enter on the field (or Tab) |
| Back to reading mode            | Escape                      |

### iPhone: VoiceOver with Safari

1. Settings > Accessibility > VoiceOver > On. A triple-click of the side button toggles it if you set up the Accessibility Shortcut.
2. Open Safari and go to the staging URL.

| Action                         | Gesture                            |
| ------------------------------ | ---------------------------------- |
| Next / previous item           | Swipe right / left with one finger |
| Activate                       | Double-tap                         |
| Rotor (choose headings, links) | Rotate two fingers on the screen   |
| Move by the rotor setting      | Swipe down / up with one finger    |
| Read from the top              | Swipe up with two fingers          |
| Stop speaking                  | Two-finger tap                     |

## 1. Every page: structure (repeat on each page)

Pages: `/`, `/work`, `/work/bdos-v3`, `/experience`, `/about`, `/contact`, `/privacy`, and `/no-such-page`.

| #   | Do                                                           | You should hear                                                                     |
| --- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| 1.1 | Load the page                                                | The page title, ending in "Pierce Rogg"                                             |
| 1.2 | NVDA: press Tab once. iPhone: swipe right once from the top. | "Skip to content, link"                                                             |
| 1.3 | Activate the skip link                                       | Focus lands on the main content, not the header                                     |
| 1.4 | Open the heading list (NVDA + F7) or rotor to Headings       | Exactly one heading level 1; level 2 and 3 headings in a sensible order, none empty |
| 1.5 | Move by landmark (D, or rotor to Landmarks)                  | Banner, "Primary" navigation, main, and content info (footer). No duplicate main.   |
| 1.6 | Read through decorative parts                                | The window dots, the diagram lines, and the "●" marks are **not** read              |

## 2. Header and menu

| #   | Do                                                 | You should hear                                                           |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------- |
| 2.1 | Windows: Tab through the header on `/work/bdos-v3` | "pierce.rogg, home, link", then the nav links; "work" says "current page" |
| 2.2 | iPhone: find the menu button                       | "Open menu, button, collapsed"                                            |
| 2.3 | Double-tap it                                      | "expanded"; the next item is the first menu link                          |
| 2.4 | Swipe through the menu                             | work, experience, about, contact, "Download resume (PDF)"                 |
| 2.5 | Activate "contact"                                 | The contact page loads and the menu is closed                             |

## 3. Home page terminal (`/`)

| #   | Do                                                  | You should hear                                                                |
| --- | --------------------------------------------------- | ------------------------------------------------------------------------------ |
| 3.1 | Move to the terminal tabs                           | "~/infrastructure, tab, selected, 1 of 3" (wording varies)                     |
| 3.2 | Windows: press Right Arrow                          | "~/operations, tab, selected, 2 of 3"; the panel now holds $150K, -25%, NIST   |
| 3.3 | Windows: press End, then Home                       | "~/leadership", then "~/infrastructure"                                        |
| 3.4 | Windows: press Tab from a tab                       | Focus moves into the panel, not to the next tab                                |
| 3.5 | iPhone: double-tap "~/leadership", then swipe right | The panel reads 10, Agile, 95%, each with its description and "src:" line      |
| 3.6 | Read the network diagram                            | One image, described as a network topology; its labels are not read one by one |

## 4. Work index and filter (`/work`)

| #   | Do                             | You should hear                                                             |
| --- | ------------------------------ | --------------------------------------------------------------------------- |
| 4.1 | Move to the filter             | "Filter by discipline, grouping"; "all, toggle button, pressed"             |
| 4.2 | Activate "documentation"       | "pressed", then "1 of 3 case studies in Documentation" without moving focus |
| 4.3 | Activate "documentation" again | "not pressed", then "3 case studies"                                        |
| 4.4 | Move to a card                 | The card title is read as one link, followed by its subheading and figure   |

## 5. Case study (`/work/bdos-v3`)

| #   | Do                          | You should hear                                                             |
| --- | --------------------------- | --------------------------------------------------------------------------- |
| 5.1 | Move to the breadcrumb      | "Breadcrumb, navigation"; "bdos-v3, current page"                           |
| 5.2 | Move through "Key figures"  | Each label read with its value, for example "canonical models, 146"         |
| 5.3 | Reach the exhibit           | "region" named after the caption; on iPhone you can swipe through its lines |
| 5.4 | Move to "More case studies" | Two links, each with "previous" or "next" and a title                       |

## 6. Experience (`/experience`)

| #   | Do                           | You should hear                                                      |
| --- | ---------------------------- | -------------------------------------------------------------------- |
| 6.1 | Move to the role list        | "list, 6 items"                                                      |
| 6.2 | Read the first role          | "2025 to present", "Founder and CEO", the organization, then bullets |
| 6.3 | Move to "Areas of expertise" | Four group headings, each followed by its list of skills             |

## 7. Contact form (`/contact`): the most important section

| #   | Do                                                        | You should hear                                                                                              |
| --- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 7.1 | Move to the LinkedIn link                                 | "linkedin/pierce-rogg, opens in a new tab, link"                                                             |
| 7.2 | Move into the form fields                                 | "Name, edit", "Work email, edit", "Reason, combo box, Interview or role", "Message, edit, multi line"        |
| 7.3 | Type "jordan@" in Work email, then move to the next field | Nothing is interrupted. Go back to Work email: "invalid entry" and "Enter an address like name@company.com." |
| 7.4 | Fix the email, move on, and come back                     | "format looks right"                                                                                         |
| 7.5 | Clear all fields and activate "Send message"              | Focus jumps to Name; you hear "Name, invalid entry, Enter your name."                                        |
| 7.6 | Open `/contact?reason=consulting`                         | Reason reads "Consulting engagement"                                                                         |
| 7.7 | Fill in every field correctly and send                    | "message sent" is announced without moving focus                                                             |
| 7.8 | Confirm the hidden spam field is never reached            | No field named "Website" anywhere, by Tab or by swiping                                                      |

Only do 7.7 once Resend is verified, and expect the test message in your inbox.

## 8. About, privacy, and 404

| #   | Do                                | You should hear                                                                     |
| --- | --------------------------------- | ----------------------------------------------------------------------------------- |
| 8.1 | `/about`: read the education card | "M.S. Computer Information Systems" as a heading, then "in progress"                |
| 8.2 | `/privacy`: heading list          | Privacy, then the contact form, analytics, cookies, hosting, and questions sections |
| 8.3 | `/no-such-page`                   | "404: route not found" as the heading, then links to ~/home, ~/work, ~/contact      |

## Results

Copy this table into a comment on PTR-31, one table per device.

| Step | NVDA + Firefox | VoiceOver + Safari | Notes |
| ---- | -------------- | ------------------ | ----- |
| 1.1  |                |                    |       |
| 1.2  |                |                    |       |
| ...  |                |                    |       |

Device and versions tested: Windows ___, NVDA ___, Firefox ___; iOS ___, Safari (system).
