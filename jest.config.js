/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  moduleNameMapper: {
    "^@hinagata/core/(.*)$": "<rootDir>/src/$1"
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          moduleResolution: "bundler",
          ignoreDeprecations: "6.0"
        }
      }
    ]
  }
};
