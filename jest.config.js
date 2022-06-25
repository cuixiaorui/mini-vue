/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  watchPathIgnorePatterns: ["/node_modules/", "/dist/", "/.git/"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  moduleNameMapper: {
    "^@mini-vue/(.*?)$": "<rootDir>/packages/$1/src",
  },
  rootDir: __dirname,
  testMatch: ["<rootDir>/packages/**/__tests__/**/*spec.[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
};
