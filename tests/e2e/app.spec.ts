import { expect, test } from "@playwright/test";

test("loads the dashboard and completes an initial review flow offline", async ({
  page
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Practice Testing DS" })).toBeVisible();

  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith("http://127.0.0.1:4173")) {
      void route.continue();
      return;
    }
    void route.abort();
  });

  await page.getByRole("button", { name: "Reveal solution" }).click();
  await page.getByRole("button", { name: "I remembered it" }).click();

  await expect(
    page.getByRole("heading", {
      level: 3,
      name: "Which option is the best fit for quickly testing one expression before editing a longer program?"
    })
  ).toBeVisible();
  await expect(page.getByText("Mountain Queue")).toBeVisible();
});
