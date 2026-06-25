import { defineConfig, devices } from "@playwright/test";

/**
 * Configuração do Playwright para o projeto SQA Social Media.
 *
 * Pré-requisitos para executar os testes:
 *   1. API rodando em http://localhost:8080  (cd api && ./mvnw spring-boot:run)
 *   2. Cliente rodando em http://localhost:3000  (cd client && npm run dev)
 *
 * Comandos úteis:
 *   npm test              → roda todos os testes (headless)
 *   npm run test:headed   → abre o browser visivelmente
 *   npm run test:e2e      → roda só os testes E2E
 *   npm run test:api      → roda só os testes de API
 *   npm run test:report   → abre o relatório HTML do último run
 */
export default defineConfig({
  // Diretório raiz onde o Playwright busca arquivos *.spec.ts
  testDir: ".",
  testMatch: ["**/*.spec.ts"],

  // Execução sequencial (sem paralelismo) para evitar conflitos de dados
  fullyParallel: false,
  workers: 1,

  // Sem retentativas em desenvolvimento
  retries: 0,

  // Relatórios: lista no terminal + HTML detalhado
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],

  use: {
    // URL base do cliente Next.js
    baseURL: "http://localhost:3000",

    // Captura trace e screenshot apenas em falhas, para facilitar o debug
    trace: "on-first-retry",
    screenshot: "only-on-failure",

    // Aguarda até 10s por padrão para cada ação
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
