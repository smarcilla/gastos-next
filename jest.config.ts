import { createDefaultPreset } from "ts-jest";

/** @type {import("jest").Config} */
module.exports = {
  // 1️⃣ Rutas donde buscar tests
  roots: ["<rootDir>/tests", "<rootDir>/src"],

  // 2️⃣ Patrón de ficheros de test
  testMatch: ["**/?(*.)+(test|spec).[tj]s?(x)"],

  // 3️⃣ Entorno por defecto (React)
  testEnvironment: "jsdom",

  // 4️⃣ Transformación TS → JS vía ts-jest
  transform: {
    ...createDefaultPreset().transform,
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json", // El tsconfig que hicimos antes
      },
    ],
  },

  // 5️⃣ Alias de imports
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // 6️⃣ Setup global (extensiones Jest-DOM, RTL, mocks…)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
