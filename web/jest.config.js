const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./"
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^@hinagata/core/(.*)$": "<rootDir>/../src/$1"
  },
  testEnvironment: "jest-environment-jsdom"
};

module.exports = createJestConfig(customJestConfig);
