import { test, expect } from "@playwright/test";

/**
 * Teste E2E 2 — Fluxo de Login e Curtida de Post
 *
 * Pré-requisitos:
 *   - API rodando em http://localhost:8080
 *   - Cliente rodando em http://localhost:3000
 */

const API = "http://localhost:8080";

test("deve fazer login e curtir/descurtir um post com sucesso", async ({
  page,
  request,
}) => {
  const email = `e2e_like_${Date.now()}@example.com`;
  const password = "ValidPass1@!";

  // ── PASSO 1: Cria o usuário via API ──────────────────────────────────────
  await request.post(`${API}/auth/signup`, { data: { email, password } });

  // ── PASSO 2: Acessa a tela de login e preenche o formulário ──────────────
  await page.goto("/signin");
  await page.getByPlaceholder("seu@email.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);

  // ── PASSO 3: Clica no botão de submit dentro do formulário (main) ─────────
  await page.locator("main").getByRole("button", { name: "Entrar" }).click();

  // ── PASSO 4: Verifica redirecionamento para a home autenticada ────────────
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: "Posts Curtidos" })).toBeVisible();

  // ── PASSO 5: Aguarda os posts carregarem ─────────────────────────────────
  await expect(page.getByRole("listitem").first()).toBeVisible({ timeout: 15_000 });

  // ── PASSO 6: Curte o primeiro post ───────────────────────────────────────
  const likeButton = page.getByRole("listitem").first().getByRole("button");
  await expect(likeButton).toContainText("Curtir");
  await likeButton.click();

  // ── PASSO 7: Confirma que o botão mudou para "Curtido" ───────────────────
  await expect(likeButton).toContainText("Curtido", { timeout: 5_000 });

  // ── PASSO 8: Descurte e confirma que voltou para "Curtir" ─────────────────
  await likeButton.click();
  await expect(likeButton).toContainText("Curtir", { timeout: 5_000 });
});
