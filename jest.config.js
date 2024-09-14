// Por padrão, o Jest não suporta ES, nem caminho absoluto,
// .env.development, dentre outras que o Next faz ou configuramos
//  para tal. Para isso, devemos configurar este arquivo.
// Criando e exportando um objeto de Configurações para o Jest:

const nextJest = require("next/jest");

const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});

const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
});

module.exports = jestConfig;
