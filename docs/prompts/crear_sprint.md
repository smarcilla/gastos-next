### Prompt‑plantilla (versión 3) — genera cualquier **sprint\_<N>.md** a partir del Roadmap

```text
## 📄 Instrucciones para ChatGPT
Recibirás dos entradas:

1. **ROADMAP.md completo** – tabla con todos los sprints.
2. **Número de sprint a generar** – por ejemplo `3`.

Debes crear un archivo **Markdown** que describa **el Sprint <N>** siguiendo el mismo diseño que `sprint_1.md`, pero con las tareas y detalles del Roadmap.

### 🔶 Estructura requerida (idéntica a sprint_1.md)
1. **Encabezado H1**
```

# Sprint <N> — <Título> (Branch `sprint/<N>-<slug>`)

```
2. Bloque _quote_ con **Objetivo** (del Roadmap) y **Duración** (si falta, usa `6 h (12 pomodoros)`).
3. Línea horizontal `---`.
4. **Sección `## Checklist`**
- Cada tarea del Roadmap → `- [ ]`
- Subtareas técnicas anidadas con **dos espacios** y comandos dentro de bloques de código.
5. `---`
6. **`## Definition of Done`** – lista de criterios medibles.
7. `---`
8. **`### Tips rápidos`** – tabla de 2 columnas (`| Tarea | Atajo |`).

### 📌 Reglas de formato
- **Todos los comandos de terminal deben usar *pnpm*** (nunca `npm`).
- No cambies la secuencia de secciones ni los títulos.
- Usa código *fenced* con lenguaje declarado (`powershell`, `bash`, `tsx`, etc.).
- Mantén texto libre al mínimo (máx. 1–2 líneas fuera de listas/tablas).
- Convierte `<Título>` a **kebab‑case** para `<slug>`.

### 🔁 Parámetros que debes rellenar
- `<N>`        → número de sprint solicitado.
- `<Título>`   → frase del Roadmap (≤ 6 palabras).
- `<slug>`     → kebab‑case del título.
- Checklist, Definition of Done y Tips → basados en las tareas/objetivos de ese sprint.

### 📝 Salida
Devuelve **solo** el Markdown final — sin comentarios adicionales — y **guárdalo en un archivo llamado `sprint_<N>.md`** (sin carpeta `docs/`).
```
