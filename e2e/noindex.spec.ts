import { expect, test } from "@playwright/test";
import { routes } from "./routes";

// NFR-12: every non-production build sends noindex. CI builds without
// VERCEL_ENV=production, so this asserts what previews and staging will serve.
test.describe("non-production builds are not indexed", () => {
  for (const route of routes) {
    test(route, async ({ request }) => {
      const response = await request.get(route);
      expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    });
  }
});
