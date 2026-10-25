import { expect, test } from "@playwright/test";
import { routes } from "./routes";

// PTR-33. Header presence, no CSP violations on any route or interaction, and
// the contact form against oversized input, header injection, and repeats
// (repeats: the rate-limit test in contact.spec.ts).

const required = [
  "content-security-policy",
  "strict-transport-security",
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
];

test("every route sends the security headers", async ({ request }) => {
  for (const route of [...routes, "/no-such-page", "/robots.txt", "/opengraph-image.png"]) {
    const res = await request.get(route);
    const headers = res.headers();
    for (const h of required) expect(headers[h], `${route} is missing ${h}`).toBeTruthy();
    expect(headers["x-powered-by"], `${route} leaks x-powered-by`).toBeUndefined();
  }
});

test("the CSP allows no third-party origins", async ({ request }) => {
  const csp = (await request.get("/")).headers()["content-security-policy"];
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).not.toMatch(/https?:\/\//);
  expect(csp).not.toContain("unsafe-eval");
});

test("no page triggers a CSP violation", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (msg) => {
    if (/Content Security Policy/i.test(msg.text())) violations.push(msg.text());
  });
  for (const route of routes) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
  }
  // Interactions that run client code: terminal tabs, work filter, contact validation.
  await page.goto("/");
  await page.getByRole("tab", { name: "~/operations" }).click();
  await page.goto("/work");
  await page.getByRole("button", { name: "delivery" }).click();
  await page.goto("/contact");
  await page.getByLabel("Work email", { exact: true }).fill("x@");
  await page.getByLabel("Name", { exact: true }).click();
  expect(violations).toEqual([]);
});

test.describe("contact form abuse, server path only", () => {
  // JavaScript off: no browser checks, so the server action alone decides.
  test.use({ javaScriptEnabled: false });
  let n = 0;
  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.9.${process.pid % 250}.${++n}` });
  });

  test("an oversized message is rejected with its text kept", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name", { exact: true }).fill("Jordan Lee");
    await page.getByLabel("Work email", { exact: true }).fill("jordan@company.com");
    const message = page.getByLabel("Message", { exact: true });
    // Remove the browser limit so the server sees 5,000 characters.
    await message.evaluate((el) => el.removeAttribute("maxlength"));
    await message.fill("x".repeat(5000));
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("One field needs attention.")).toBeVisible();
    expect((await message.inputValue()).length).toBe(5000);
    await expect(page.getByText(/Keep it to 2,000 characters/)).toBeVisible();
  });

  test("a line break in the email field is rejected", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name", { exact: true }).fill("Jordan Lee");
    const email = page.getByLabel("Work email", { exact: true });
    await email.evaluate((el) => el.setAttribute("type", "text"));
    await email.fill("jordan@company.com\nBcc: victim@example.com");
    await page
      .getByLabel("Message", { exact: true })
      .fill("Testing header injection through the email field.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("One field needs attention.")).toBeVisible();
    await expect(page.getByText("message sent")).toHaveCount(0);
  });
});
