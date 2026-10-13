---
name: Next App Router root selection
description: Prevent legacy Vite Pages Router folders from confusing a root-level Next App Router.
---

When a Next.js App Router lives in the project-root `app/`, move unused legacy `src/pages` files out of `src/` before building. Next can detect the `src/` router layout and generate phantom `src/app` route validations even when the real routes live in root `app/`.

**Why:** A root-level Next migration failed type validation because an unrelated legacy `src/pages` fallback caused Next to expect routes under `src/app`.

**How to apply:** Before building a root-level App Router, check whether `src/pages` exists and relocate legacy-only files; clear generated `.next` output after changing the route layout.
