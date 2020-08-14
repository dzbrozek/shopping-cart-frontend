const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  "plugins": [
    "@typescript-eslint",
    "react",
    "prettier",
    "testing-library"
  ],
  "extends": [
    "airbnb",
    "react-app",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
    "plugin:testing-library/react"
  ],
  "rules": {
    "prettier/prettier": "off",
    "react/jsx-filename-extension": ["error", { "extensions": [".tsx"] }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
   ],
    "import/no-extraneous-dependencies": "off",
    "react/prop-types": "off",
    "react/state-in-constructor": "off",
    "class-methods-use-this": "off",
    "import/order": [
      "warn",
      {
        "groups": [["external", "builtin"], ["internal"], ["sibling", "parent", "index"]],
        "newlines-between": "always-and-inside-groups"
      }
    ],
    "import/prefer-default-export": "off",
    "react/jsx-props-no-spreading": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
      },
    ],
    "react/destructuring-assignment": "warn",
  },
  "settings": {
    "import/resolver": {
      "node": {
        paths: [path.resolve(__dirname, 'src')],
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  "overrides": [
    {
      "files": ["**/__tests__/*.test.{ts,tsx}"],
      "rules": {
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    }
  ],

}
