import database from "infra/database";
import { waitForAllServices } from "tests/orchestrator";

beforeAll(async () => {
  await waitForAllServices();
  // Limpando o Banco para iniciar os testes sempre com o mesmo state
  await database.query("drop schema public cascade; create schema public");
});

test("POST to /api/v1/migrations should return 200", async () => {
  // Testando a 1a Requisição: deve retornar > 1, pois temos alguma Migration para rodar
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();

  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  // Testando a 2a Requisição: deve retornar = 0, pois todas as Migrations já rodaram na 1a Requisição
  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
});
