# Sprint 1 — Bootstrap Frontend (Branch `sprint/1-bootstrap`)

> **Objetivo:** crear la base técnica de la aplicación Next 15 con TailwindCSS, shadcn/ui y React Query, dejando un _Hello World_ visible y sin errores de ESLint.
>
> **Duración estimada:** 6 h (12 pomodoros)

---

## Checklist

- [x] **Crear rama de sprint**

  ```powershell
  git checkout -b sprint/1-bootstrap
  ```

- [x] **Generar la app Next 15** en la raíz del repo (mantiene docs y config existentes).

```powershell
# 1. Genera la app Next 15 en una carpeta temporal
pnpx create-next-app@latest tmp-next `
     --ts --tailwind --app --eslint `
     --src-dir --import-alias "@/*" `
     --use-pnpm --no-git

# 2. Borra los archivos que causan conflicto en la raíz
Remove-Item -Force package.json,pnpm-lock.yaml -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules,.husky -ErrorAction SilentlyContinue

# 3. Mueve el contenido generado a la raíz del repo
Move-Item -Path .\tmp-next\* -Destination . -Force
Remove-Item -Recurse -Force .\tmp-next

# 4. Instala todas las dependencias
pnpm install
```

- [x] **Verificar** que `pnpm dev` levanta `localhost:3000` con la página de bienvenida de Next 15.

- [x] **Instalar React Query**

  ```powershell
  pnpm add @tanstack/react-query
  ```
  - [x] **Re-inicializar Husky** (tras mover archivos se pierde `.husky`)

```powershell
# 1. Elimina el fichero corrupto
Remove-Item .husky\pre-commit

# 2. Crea el hook correctamente
New-Item .husky/pre-commit -ItemType File -Force
Set-Content .husky/pre-commit "pnpm exec lint-staged" -NoNewline

# 3. (git) Marca el archivo como ejecutable
git add .husky/pre-commit
git update-index --chmod=+x .husky/pre-commit
```

- [x] **Configurar shadcn/ui**

```powershell
# 1. Inicializar shadcn
pnpm dlx shadcn@latest init -y

# 2. Añadir componentes, p. ej. Button y Card
pnpm dlx shadcn@latest add button card
```

- [x] **Crear layout mínimo**
  - `/src/app/layout.tsx` con `<html lang="es">`, `<body className="font-sans">`.
  - `/src/app/page.tsx` que muestre:

    ```tsx
    import { Button } from "@/components/ui/button";
    export default function Home() {
      return (
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-4">Hola Gastos‑Next 👋</h1>
          <Button>¡Funciona!</Button>
        </main>
      );
    }
    ```

- [x] **Ejecutar linter y tests vacíos**

  ```powershell
  pnpm lint
  ```

- [x] **Actualizar `.gitignore`** si el generador añadió carpetas nuevas (ej. `/.vscode-test`).

- [x] **Commit y push**

  ```powershell
  git add .
  git commit -m "feat: bootstrap Next 15 + Tailwind + shadcn/ui + React Query"
  git push -u origin sprint/1-bootstrap
  ```

- [x] **Crear Pull Request** → revisar, squash‑merge a `main`.

- [x] **Marcar** la fila «Semana 1» como ✅ en `ROADMAP.md`.

---

\## Definition of Done

- `pnpm dev` corre sin errores y muestra el layout con botón shadcn.
- ESLint pasa sin warnings (gracias a `--max-warnings=0`).
- Todos los archivos generados/compilados ignorados por Git.
- Branch `sprint/1-bootstrap` mergeado a `main`; checklist marcada y Roadmap actualizado.

---

### Tips rápidos

| Tarea                                            | Atajo                                 |
| ------------------------------------------------ | ------------------------------------- |
| Volver a instalar dependencias tras el generador | `pnpm install`                        |
| Arrancar dev server con salida más limpia        | `pnpm dev --turbo`                    |
| Añadir otro componente UI shadcn                 | `pnpm dlx shadcn-ui@latest add input` |
