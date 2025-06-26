// .eslintrc.cjs
module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals", // 🟢 Activa eslint-config-next + reglas Core Web Vitals
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  settings: {
    react: { version: "detect" }, // 🟢 El plugin detecta tu versión automáticamente
  },
  rules: {
    // Ejemplo: ajustes propios
    "@typescript-eslint/explicit-function-return-type": "off",
    // No hace falta tocar react/react-in-jsx-scope: queda "off" por la config de Next
  },
};
