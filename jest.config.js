module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "globals": {
    "ts-jest": {
      "tsConfigFile": "tsconfig.json"
    }
  }
}