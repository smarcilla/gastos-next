# Sprint 0 — Kick‑off (Branch `sprint/0-kickoff`)

> Objetivo: dejar el repositorio listo para trabajar — README, Roadmap, configuración de Husky + ESLint/Prettier y primer commit protegido por _lint_.

---

## Checklist

- [x] **Clonar** el repo localmente en VS Code (`Git: Clone`).
- [x] **Crear** y posicionarse en la rama `sprint/0-kickoff`  
       `git checkout -b sprint/0-kickoff`
- [x] **Copiar** `ROADMAP.md` del canvas al repo y crear `README.md` básico.
- [x] **Inicializar** proyecto Node  
       `pnpm init -y` _(o `npm init -y` si prefieres)_
- [x] **Instalar** tooling de calidad  
       `pnpm add -D husky lint-staged eslint prettier`
- [x] **Configurar Husky**  
       `pnpm exec husky init`

  ```sh
  #!/usr/bin/env sh
  . "$(dirname "$0")/_/husky.sh"

  pnpm lint-staged
  ```

````

- [x] **Añadir scripts** y `lint-staged` en `package.json`:
  ```json
  "scripts": {
    "lint": "eslint . --ext .js,.ts,.tsx --max-warnings=0"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": "eslint --fix"
  }
````

- [x] Crear .gitignore

- [x] **Agregar y commitear** cambios  
       `git add .`  
       `git commit -m "chore: sprint‑0 setup"`
- [x] **Push** inicial  
       `git push -u origin sprint/0-kickoff`
- [x] **Abrir Pull Request** a `main`; revisarlo y **merge** (squash‑merge recomendado).
- [x] **Marcar** la fila «Semana 0» como ✅ en `ROADMAP.md`.

---

## Criterio de terminado (_Definition of Done_)

- El branch `main` contiene `README.md`, `ROADMAP.md` y la configuración de Husky.
- Ejecutar `git commit` dispara el _pre‑commit_ y bloquea si hay errores de ESLint.
- No quedan advertencias (`max-warnings=0`).
- Se ha cerrado la PR y eliminado la rama `sprint/0-kickoff`.

---

### Siguiente Sprint → **Sprint 1**

Crear la app Next 15 con Tailwind y shadcn/ui (`npx create-next-app@latest …`).
