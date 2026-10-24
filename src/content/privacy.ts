/**
 * Privacy page content (PTR-50). Every statement must match the code:
 * src/lib/contact/* for the form, src/lib/site.ts `analytics` for analytics.
 * Provider facts were checked on 2026-10-24 against Resend's pricing and GDPR
 * pages and Vercel's Web Analytics privacy documentation; recheck them before
 * launch and whenever a provider changes. Needs Client approval.
 */

export const updated = { iso: "2026-10-24", label: "October 24, 2026" };

export const sections = {
  form: {
    heading: "The contact form",
    paragraphs: [
      "The form collects four things: your name, your email address, the reason you picked, and your message. It sends them to me as one email through Resend, an email delivery service. This site does not store them in a database or write them to its logs.",
      "Resend keeps the email and its delivery log for 30 days, then deletes them. My copy stays in my inbox until I delete it.",
      "To limit spam, the site counts messages per IP address for one hour. The count lives only in server memory, holds no message content, and expires on its own.",
    ],
  },
  hosting: {
    heading: "Hosting",
    paragraphs: [
      "The site runs on Vercel. Like any web host, Vercel records standard request details, such as IP address, page, and time, to operate and secure the service. This site adds nothing to those records.",
    ],
  },
  cookies: {
    heading: "Cookies",
    paragraphs: ["This site sets no cookies."],
  },
  deletion: {
    heading: "Questions about your message",
    paragraphs: [
      "To ask about a message you sent, or to have it removed, write through the contact form or on LinkedIn.",
    ],
  },
} as const;

export const analyticsOn = {
  heading: "Analytics",
  paragraphs: [
    "The site counts page views with Vercel Web Analytics, which uses no cookies. It sees the page, the referring site, country and region, browser, operating system, and device type. To count unique visitors it uses a hash of the request that is discarded after 24 hours, and it never stores your IP address. I see only totals.",
  ],
};

export const analyticsOff = {
  heading: "Analytics",
  paragraphs: ["This site runs no analytics and no tracking scripts."],
};
