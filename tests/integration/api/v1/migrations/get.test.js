import database from "infra/database";
import { waitForAllServices } from "tests/orchestrator";

beforeAll(async () => {
  await waitForAllServices();
  // Limpando o Banco para iniciar os testes sempre com o mesmo state
  await database.query("drop schema public cascade; create schema public");
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Retrieving pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);

      // Criando um teste que verifica que está retornando uma lista de Migrations a serem executadas
      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
