module.exports = {
  extends: "eslint:recommended",
  env: {
    browser: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "lit"],
  rules: {
    "no-cond-assign": "off", 
    "no-console": "off", 
    "no-unused-vars": "off",
    "no-debugger": "off",
    // todo - fix warn/off rules 
    "lit/no-duplicate-template-bindings": "error",
    "lit/no-template-bind": "error",
    "lit/no-template-map": "warn",
    "lit/no-useless-template-literals": "error",
    "lit/attribute-value-entities": "error",
    "lit/no-invalid-html": "error"
  }
};
