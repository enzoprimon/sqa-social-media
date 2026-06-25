import { test, expect } from "@playwright/test";

/**
 * Testes de API — Caixa-Preta (Black-Box)
 *
 * Pré-requisito: API rodando em http://localhost:8080
 *
 * Teste 1 (SUCESSO) : POST /auth/signup com dados válidos → 200
 * Teste 2 (SUCESSO) : POST /auth/signup com e-mail duplicado → 409
 * Teste 3 (SUCESSO) : POST /auth/signin com credenciais corretas → 200
 * Teste 4 (SUCESSO) : POST /auth/signin com senha incorreta → 401
 */

const API = "http://localhost:8080";
const uniqueEmail = () => `user_${Date.now()}@example.com`;

// ─────────────────────────────────────────────────────────────────────────────
// TESTE 1 — Cadastro com dados válidos deve retornar 200
// ─────────────────────────────────────────────────────────────────────────────
test("POST /auth/signup — dados válidos deve retornar 200 e o e-mail do usuário", async ({
  request,
}) => {
  const email = uniqueEmail();

  const response = await request.post(`${API}/auth/signup`, {
    data: { email, password: "ValidPass1@!" },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.email).toBe(email);
  expect(body.id).toBeDefined();
});

// ─────────────────────────────────────────────────────────────────────────────
// TESTE 2 — Cadastro com e-mail duplicado deve retornar 409
// ─────────────────────────────────────────────────────────────────────────────
test("POST /auth/signup — e-mail duplicado deve retornar 409", async ({
  request,
}) => {
  const email = uniqueEmail();

  // Primeiro cadastro — sucesso
  await request.post(`${API}/auth/signup`, {
    data: { email, password: "ValidPass1@!" },
  });

  // Segundo cadastro com o mesmo e-mail — deve conflitar
  const response = await request.post(`${API}/auth/signup`, {
    data: { email, password: "ValidPass1@!" },
  });

  expect(response.status()).toBe(409);

  const body = await response.json();
  expect(body.message).toBe("E-mail já está em uso");
});

// ─────────────────────────────────────────────────────────────────────────────
// TESTE 3 — Login com credenciais corretas deve retornar 200
// ─────────────────────────────────────────────────────────────────────────────
test("POST /auth/signin — credenciais corretas deve retornar 200", async ({
  request,
}) => {
  const email = uniqueEmail();
  const password = "ValidPass1@!";

  await request.post(`${API}/auth/signup`, { data: { email, password } });

  const response = await request.post(`${API}/auth/signin`, {
    data: { email, password },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.email).toBe(email);
  expect(body.id).toBeDefined();
});

// ─────────────────────────────────────────────────────────────────────────────
// TESTE 4 — Login com senha incorreta deve retornar 401
// ─────────────────────────────────────────────────────────────────────────────
test("POST /auth/signin — senha incorreta deve retornar 401", async ({
  request,
}) => {
  const email = uniqueEmail();

  await request.post(`${API}/auth/signup`, {
    data: { email, password: "ValidPass1@!" },
  });

  const response = await request.post(`${API}/auth/signin`, {
    data: { email, password: "SenhaErrada9@!" },
  });

  expect(response.status()).toBe(401);

  const body = await response.json();
  expect(body.message).toBe("Credenciais inválidas");
});
