import { expect, test, type Page } from "@playwright/test";

// PTR-24 (page) and PTR-27 (form). The server runs with CONTACT_TRANSPORT=test,
// so nothing is emailed; "[[fail]]" in a message simulates a provider failure.
// Each test sends from its own fake IP so the rate limit does not leak between tests.
let n = 0;
async function asIp(page: Page) {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.0.${process.pid % 250}.${++n}` });
}

async function fill(
  page: Page,
  message = "We need help planning a server migration next quarter.",
) {
  await page.getByLabel("Name", { exact: true }).fill("Jordan Lee");
  await page.getByLabel("Work email", { exact: true }).fill("jordan@company.com");
  await page.getByLabel("Message", { exact: true }).fill(message);
}

test("profile links open in a new tab with rel=noopener", async ({ page }) => {
  await page.goto("/contact");
  for (const name of [/linkedin\/pierce-rogg/, /github\/progg1992/]) {
    const link = page.getByRole("main").getByRole("link", { name });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
  await expect(page.getByRole("main").getByRole("link", { name: /linkedin/ })).toHaveAttribute(
    "href",
    "https://linkedin.com/in/pierce-rogg",
  );
});

test("every field has a visible label", async ({ page }) => {
  await page.goto("/contact");
  for (const label of ["Name", "Work email", "Reason", "Message"]) {
    await expect(page.getByLabel(label, { exact: true })).toBeVisible();
  }
});

test("?reason= preselects the reason", async ({ page }) => {
  await page.goto("/contact?reason=consulting");
  await expect(page.getByLabel("Reason", { exact: true })).toHaveValue("consulting");
  await page.goto("/contact?reason=nonsense");
  await expect(page.getByLabel("Reason", { exact: true })).toHaveValue("interview");
});

test("fields validate on blur with described errors", async ({ page }) => {
  await page.goto("/contact");
  const email = page.getByLabel("Work email", { exact: true });
  await email.fill("jordan@");
  await email.blur();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  const describedBy = await email.getAttribute("aria-describedby");
  await expect(page.locator(`#${describedBy}`)).toContainText("name@company.com");
  await email.fill("jordan@company.com");
  await email.blur();
  await expect(email).not.toHaveAttribute("aria-invalid");
  await expect(page.getByText("format looks right")).toBeVisible();

  const message = page.getByLabel("Message", { exact: true });
  await message.fill("too short");
  await message.blur();
  await expect(page.getByText(/at least 20 characters \(9 so far\)/)).toBeVisible();
});

test("submitting an empty form stops in the browser and focuses the first error", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByLabel("Name", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Name", { exact: true })).toHaveAttribute("aria-invalid", "true");
});

test("a valid message sends and success is announced", async ({ page }) => {
  await asIp(page);
  await page.goto("/contact?reason=question");
  await fill(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toHaveText(/message sent/);
});

test("a provider failure keeps the text and offers LinkedIn", async ({ page }) => {
  await asIp(page);
  await page.goto("/contact");
  await fill(page, "Testing the failure path with enough characters. [[fail]]");
  await page.getByRole("button", { name: "Send message" }).click();
  const status = page.getByRole("status");
  await expect(status).toContainText("did not send");
  await expect(status.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    "https://linkedin.com/in/pierce-rogg",
  );
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(/\[\[fail\]\]/);
});

test("the sixth message in an hour from one IP is refused", async ({ page }) => {
  await asIp(page);
  for (let i = 0; i < 5; i++) {
    await page.goto("/contact");
    await fill(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toHaveText(/message sent/);
  }
  await page.goto("/contact");
  await fill(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("Too many messages");
});

test("the honeypot is hidden from people and assistive tech", async ({ page }) => {
  await page.goto("/contact");
  const trap = page.locator('input[name="website"]');
  await expect(trap).toHaveAttribute("tabindex", "-1");
  await expect(trap).not.toBeInViewport();
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the form still posts and the server answers", async ({ page }) => {
    await asIp(page);
    await page.goto("/contact");
    await fill(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("message sent")).toBeVisible();
  });

  // With no browser checks at all, the server is the only validator, as it is
  // for any direct POST.
  test("the server re-validates and returns errors with the text kept", async ({ page }) => {
    await asIp(page);
    await page.goto("/contact");
    await fill(page, "short");
    await page.getByLabel("Work email", { exact: true }).fill("not-an-email");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("2 fields need attention.")).toBeVisible();
    await expect(page.getByLabel("Work email", { exact: true })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page.getByLabel("Message", { exact: true })).toHaveValue("short");
  });
});
