// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { validate, validateField, isReason } = await import("./validate");
const { allow, reset, MAX_PER_WINDOW, WINDOW_MS } = await import("./rate-limit");
const { deliver } = await import("./deliver");

const good = {
  name: "Jordan Lee",
  email: "jordan@company.com",
  reason: "consulting",
  message: "We need help planning a server migration next quarter.",
};

describe("validate", () => {
  it("accepts a complete message", () => {
    expect(validate(good)).toEqual({});
  });

  it("requires a name and a well-formed email", () => {
    expect(validateField("name", "   ")).toBeDefined();
    expect(validateField("email", "jordan@")).toBeDefined();
    expect(validateField("email", "a b@c.com")).toBeDefined();
  });

  it("holds the message to 20 to 2,000 characters", () => {
    expect(validateField("message", "x".repeat(19))).toMatch(/at least 20/);
    expect(validateField("message", "x".repeat(20))).toBeUndefined();
    expect(validateField("message", "x".repeat(2000))).toBeUndefined();
    expect(validateField("message", "x".repeat(2001))).toMatch(/2,000/);
  });

  it("accepts only the listed reasons", () => {
    expect(isReason("consulting")).toBe(true);
    expect(isReason("sales")).toBe(false);
    expect(validateField("reason", "<script>")).toBeDefined();
  });
});

describe("rate limit", () => {
  beforeEach(() => reset());

  it("allows five submissions per IP per hour, then refuses", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < MAX_PER_WINDOW; i++) expect(allow("1.2.3.4", t0 + i)).toBe(true);
    expect(allow("1.2.3.4", t0 + 10)).toBe(false);
    expect(allow("5.6.7.8", t0 + 10)).toBe(true);
  });

  it("frees a slot once the oldest submission is an hour old", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < MAX_PER_WINDOW; i++) allow("1.2.3.4", t0 + i);
    expect(allow("1.2.3.4", t0 + WINDOW_MS - 1)).toBe(false);
    expect(allow("1.2.3.4", t0 + WINDOW_MS + 1)).toBe(true);
  });
});

describe("deliver", () => {
  it("fails closed when the provider is not configured", async () => {
    vi.stubEnv("CONTACT_TRANSPORT", "");
    vi.stubEnv("EMAIL_PROVIDER_API_KEY", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await deliver(good)).toBe("failed");
  });

  it("ignores the test transport in production", async () => {
    vi.stubEnv("CONTACT_TRANSPORT", "test");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("EMAIL_PROVIDER_API_KEY", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await deliver(good)).toBe("failed");
  });

  it("sends JSON to Resend with reply_to set and no line breaks in the subject", async () => {
    vi.stubEnv("CONTACT_TRANSPORT", "");
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("EMAIL_PROVIDER_API_KEY", "re_test");
    vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "site@example.com");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await deliver({ ...good, name: "Jordan\r\nBcc: x@evil.test" })).toBe("sent");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    const body = JSON.parse(init.body);
    expect(body.reply_to).toBe(good.email);
    expect(body.to).toEqual(["inbox@example.com"]);
    expect(body.subject).not.toMatch(/[\r\n]/);
    vi.unstubAllGlobals();
  });

  it("logs only the status code when the provider refuses", async () => {
    vi.stubEnv("EMAIL_PROVIDER_API_KEY", "re_test");
    vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "site@example.com");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 422 })));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await deliver(good)).toBe("failed");
    expect(log).toHaveBeenCalledWith("contact: provider returned 422");
    expect(JSON.stringify(log.mock.calls)).not.toContain(good.email);
    vi.unstubAllGlobals();
  });
});
