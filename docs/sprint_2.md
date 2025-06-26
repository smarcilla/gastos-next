# Sprint 2 — ESLint/Prettier + tests vacíos (Branch `sprint/2-eslint-prettier-tests-vacios`)

> **Objetivo**: ESLint/Prettier + tests vacíos  
> **Duración**: 6 h (12 pomodoros)

---

## Checklist

- [x] Configurar ESLint para Next 15 + TypeScript
  ```bash
  pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-next
  pnpm exec eslint --init
  ```
- [x] Instalar Prettier y reglas de integración
  ```bash
  pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
  ```
- [ ] Crear scripts de formateo y lint en `package.json`
  ```json
  {
    "scripts": {
      "lint": "eslint . --ext .ts,.tsx",
      "format": "prettier --write ."
    }
  }
  ```
- [x] Integrar husky + lint‑staged
  ```bash
  pnpm add -D husky lint-staged
  pnpm exec husky install
  pnpm pkg set lint-staged.'*.{ts,tsx,js,jsx,json,md}'='pnpm format'
  ```
- [x] Configurar Jest + React Testing Library con setup vacío
  ```bash
  pnpm add -D jest @types/jest ts-jest jest-environment-jsdom @testing-library/react
  pnpm exec ts-jest config:init
  ```
- [x] Añadir ejemplo de test vacío

  ```tsx
  // __tests__/app.test.tsx
  test("smoke test", () => {
    expect(true).toBe(true);
  });
  ```

- [x] Desactivar o renombrar eslint.config.mjs.
      renombrar fichero a .bak para que no interfiera en .eslintrc.js
- [x] Añadir workflow CI lint + test (GitHub Actions)
  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v3
          with:
            version: 9
        - run: pnpm install
        - run: pnpm lint
        - run: pnpm test
  ```

---

## Definition of Done

- Todos los archivos pasan `pnpm lint` sin warnings ni errores.
- `pnpm format` no introduce cambios tras ejecución.
- Test suite (`pnpm test`) devuelve 0 tests fallidos.
- El hook de pre‑commit formatea y linta antes de cada commit.
- El workflow de CI pasa en la rama `sprint/2-*` y en `main`.

---

### Tips rápidos

| Tarea                       | Atajo                                                              |
| --------------------------- | ------------------------------------------------------------------ |
| Lintear el repo completo    | `pnpm lint --fix`                                                  |
| Formatear cambios stageados | `pnpm exec lint-staged`                                            |
| Modo watch de tests         | `pnpm exec jest --watch`                                           |
| Añadir nuevo hook Husky     | `pnpm exec husky add .husky/pre-commit "pnpm lint && pnpm format"` |

### Logs

- 25/06/2025 | Falla github actions en repo
- 24/06/2025 | Fallan los unit tests
