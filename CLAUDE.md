# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## About this project

Arcade Vault: plataforma para jugar online y competir por puntuación. El proyecto está en etapa inicial (scaffold de `create-next-app`, sin funcionalidad propia todavía).

## Commands

- `npm run dev` — inicia el servidor de desarrollo (Next.js).
- `npm run build` — build de producción.
- `npm run start` — sirve el build de producción.
- `npm run lint` — ejecuta ESLint (`eslint-config-next`, core-web-vitals + typescript).

No hay suite de tests configurada todavía.

## Architecture

- Next.js 16 con App Router (`app/`), React 19, TypeScript estricto (`tsconfig.json` con `strict: true`).
- Alias de import `@/*` apunta a la raíz del proyecto.
- Estilos con Tailwind CSS v4 vía `@tailwindcss/postcss` (`postcss.config.mjs`); sin `tailwind.config` (config por defecto de v4).
- `app/layout.tsx` y `app/page.tsx` son los únicos archivos de la app por ahora — no hay rutas, componentes ni lógica de negocio adicionales aún.

## Skills

Usa siempre el /frontend-design para diseñar la interfaz de usuario.

## Important: unfamiliar Next.js version

Este repo usa Next.js 16, que introduce cambios que rompen compatibilidad respecto a versiones anteriores más comunes en datos de entrenamiento. Antes de escribir código relacionado con routing, data fetching, server actions, config, etc., consulta la documentación local en `node_modules/next/dist/docs/` (carpetas `01-app`, `02-pages`, `03-architecture`) en vez de asumir comportamiento de versiones previas.

## Metodología: Spec Driven Design

Este proyecto sigue un flujo basado en specs, usando las skills de `Klerith/fernando-skills` (comandos `/spec` y `/spec-impl`). Si esas skills no están instaladas, se instalan con:

```bash
npx skills@latest add Klerith/fernando-skills
```
