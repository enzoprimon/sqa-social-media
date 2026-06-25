import { test, expect } from "@playwright/test";

test("deve cadastrar um novo usuário e redirecionar para a home autenticado", async ({
  page,
}) => {
  const email = `e2e_signup_${Date.now()}@example.com`;
  const password = "ValidPass1@!";

  await page.goto("/");

  await page.getByRole("banner").getByRole("button", { name: "Criar Conta" }).click();
  await expect(page).toHaveURL("/signup");

  await page.getByPlaceholder("seu@email.com").fill(email);
  await page.getByPlaceholder("••••••••").first().fill(password);
  await page.getByPlaceholder("••••••••").last().fill(password);

  await page.locator("main").getByRole("button", { name: "Criar Conta" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: "Posts Curtidos" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).not.toBeVisible();
});
