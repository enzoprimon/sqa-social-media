import { test, expect } from "@playwright/test";

const API = "http://localhost:8080";

test("deve fazer login e curtir/descurtir um post com sucesso", async ({
  page,
  request,
}) => {
  const email = `e2e_like_${Date.now()}@example.com`;
  const password = "ValidPass1@!";


  await request.post(`${API}/auth/signup`, { data: { email, password } });

  await page.goto("/signin");
  await page.getByPlaceholder("seu@email.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);

  await page.locator("main").getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: "Posts Curtidos" })).toBeVisible();

  await expect(page.getByRole("listitem").first()).toBeVisible({ timeout: 15_000 });

  const likeButton = page.getByRole("listitem").first().getByRole("button");
  await expect(likeButton).toContainText("Curtir");
  await likeButton.click();

  await expect(likeButton).toContainText("Curtido", { timeout: 5_000 });

  await likeButton.click();
  await expect(likeButton).toContainText("Curtir", { timeout: 5_000 });
});
