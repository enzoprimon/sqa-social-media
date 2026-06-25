import { test, expect } from "@playwright/test";

const API = "http://localhost:8080";
const uniqueEmail = () => `user_${Date.now()}@example.com`;

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

test("POST /auth/signup — e-mail duplicado deve retornar 409", async ({
  request,
}) => {
  const email = uniqueEmail();

  await request.post(`${API}/auth/signup`, {
    data: { email, password: "ValidPass1@!" },
  });


  const response = await request.post(`${API}/auth/signup`, {
    data: { email, password: "ValidPass1@!" },
  });

  expect(response.status()).toBe(409);

  const body = await response.json();
  expect(body.message).toBe("E-mail já está em uso");
});

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
