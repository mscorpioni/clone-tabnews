import migrationRunner from "node-pg-migrate";

// módulo para criar caminhos de forma correta para diferentes sistemas operacionais, colocando / ou \ conforme o sistema
import { resolve } from "node:path";

import database from "infra/database";

export default async function migratons(request, response) {
  // Verifica se o Request method é um GET ou POST
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    // Gerar uma mensagem de erro caso outro método seja usado além do GET ou POST
    return response.status(405).json({
      error: `Method ${request.method} not allowed.`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
