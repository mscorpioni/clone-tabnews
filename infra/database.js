import { Client } from "pg";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};
export default database;

function getSSLValues() {
  // Caso o banco use um Self-signed Certificate
  if (process.env.POSTGRES_CA) {
    return process.env.POSTGRES_CA;
  }

  // Checa se está no ambiente de desenvolvimento, para não usar SSL
  return process.env.NODE_ENV === "production" ? true : false;
}
