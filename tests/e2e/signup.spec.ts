import { test, expect } from "@playwright/test";

/**
 * Teste E2E 1 — Fluxo Completo de Cadastro
 *
 * Pré-requisitos:
 *   - API rodando em http://localhost:8080
 *   - Cliente rodando em http://localhost:3000
 */

test("deve cadastrar um novo usuário e redirecionar para a home autenticado", async ({
  page,
}) => {
  const email = `e2e_signup_${Date.now()}@example.com`;
  const password = "ValidPass1@!";

  // ── PASSO 1: Acessa a página inicial ─────────────────────────────────────
  await page.goto("/");

  // ── PASSO 2: Clica em "Criar Conta" no Header (banner) ───────────────────
  await page.getByRole("banner").getByRole("button", { name: "Criar Conta" }).click();
  await expect(page).toHaveURL("/signup");

  // ── PASSO 3: Preenche o formulário ───────────────────────────────────────
  await page.getByPlaceholder("seu@email.com").fill(email);
  await page.getByPlaceholder("••••••••").first().fill(password);
  await page.getByPlaceholder("••••••••").last().fill(password);

  // ── PASSO 4: Clica no botão de submit dentro do formulário (main) ─────────
  await page.locator("main").getByRole("button", { name: "Criar Conta" }).click();

  // ── PASSO 5: Verifica redirecionamento e estado autenticado ───────────────
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: "Posts Curtidos" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).not.toBeVisible();
});
