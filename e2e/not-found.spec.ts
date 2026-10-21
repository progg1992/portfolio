import { expect, test } from "@playwright/test";

// FR-10 and FR-19: an unknown case study slug returns a real 404, not a 200 or a 500.
test("unknown case study slug returns 404", async ({ request }) => {
  const response = await request.get("/work/does-not-exist");
  expect(response.status()).toBe(404);
});

test("unknown route returns 404", async ({ request }) => {
  const response = await request.get("/no-such-page");
  expect(response.status()).toBe(404);
});
