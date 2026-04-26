import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["dist/**/*"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
    },
    linterOptions: {
      reportUnusedInlineConfigs: "error",
    },
    rules: {
      yoda: "error",
      radix: "error",
      "no-new": "error",
      "no-eval": "error",
      "new-cap": "error",
      "no-caller": "error",
      "no-console": "warn",
      "no-label-var": "error",
      "no-lonely-if": "error",
      "no-script-url": "error",
      "prefer-spread": "error",
      "no-unused-vars": "warn",
      "no-extra-label": "error",
      "prefer-template": "error",
      "no-useless-call": "error",
      "no-multi-assign": "error",
      "no-invalid-this": "error",
      "no-implied-eval": "error",
      "no-return-assign": "error",
      "no-throw-literal": "error",
      "no-useless-concat": "error",
      "no-param-reassign": "warn",
      "default-case-last": "error",
      "no-nested-ternary": "error",
      "no-useless-return": "error",
      "prefer-rest-params": "error",
      "one-var": ["error", "never"],
      "no-unneeded-ternary": "error",
      "no-unreachable-loop": "error",
      "prefer-object-spread": "error",
      "no-implicit-coercion": "error",
      "no-negated-condition": "error",
      "no-object-constructor": "error",
      "no-useless-assignment": "warn",
      "no-use-before-define": "error",
      "no-useless-constructor": "error",
      "require-atomic-updates": "error", // Discourage race condition with assignments using await or yield
      "no-useless-computed-key": "error",
      "func-style": ["error", "expression"],
      "no-template-curly-in-string": "warn",
      "prefer-promise-reject-errors": "error",
      "no-unmodified-loop-condition": "error",
      "prefer-exponentiation-operator": "error",
      "no-undef": ["error", { typeof: true }],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "max-lines-per-function": ["error", { max: 60 }], // Max 60 lines for function
      "prefer-const": ["error", { destructuring: "all" }],
      "use-isnan": ["error", { enforceForIndexOf: true }],
      "no-duplicate-imports": ["error", { includeExports: true }],
      "valid-typeof": ["error", { requireStringLiterals: true }],
      "no-unused-expressions": ["warn", { ignoreDirectives: true }],
      "dot-notation": ["warn", { allowPattern: "^[a-z]+(_[a-z]+)+$" }],
      "prefer-destructuring": ["warn", { object: true, array: false }],
      "no-unsafe-negation": ["error", { enforceForOrderingRelations: true }],
      "no-extra-boolean-cast": ["error", { enforceForInnerExpressions: true }],
      "array-callback-return": [
        "error",
        { checkForEach: true, allowVoid: true },
      ],
      "no-inner-declarations": [
        "error",
        "both",
        { blockScopedFunctions: "disallow" },
      ],
      "arrow-body-style": [
        "error",
        "as-needed",
        { requireReturnForObjectLiteral: true },
      ],
      "capitalized-comments": [
        "warn",
        "always",
        {
          ignorePattern: "falls through",
          ignoreInlineComments: true,
          ignoreConsecutiveComments: true,
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "SequenceExpression",
          message:
            "The comma operator is confusing and a common mistake. Don't use it!",
        },
      ],
    },
  },
  {
    files: ["**/*.{test,spec}.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "no-undef": "warn",
      "max-lines-per-function": "off",
    },
  },
]);
