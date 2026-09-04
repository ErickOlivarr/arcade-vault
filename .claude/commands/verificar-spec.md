---
description: Verifica los criterios de aceptación de una spec usando el subagente spec-acceptance-verifier
argument-hint: [spec] (opcional — nombre, número o slug; ruta a specs/*.md; si se omite, usa la spec de número más alto)
---

El argumento recibido es: `$ARGUMENTS`

## Paso 1 — Resolver qué spec verificar

- Si `$ARGUMENTS` está vacío: lista los archivos `specs/*.md` (ignorando los que terminan en `-fixes.md`), identifica el prefijo numérico de cada uno (`01-`, `02-`, …) y toma el de número más alto como la spec a verificar. Si no hay ningún archivo en `specs/`, dilo y detente — no hay nada que verificar.
- Si `$ARGUMENTS` tiene un valor: puede venir como ruta (`specs/01-mvp-pantallas.md`, con o sin el prefijo `@`), solo el número (`01`), o solo el slug (`mvp-pantallas`). Búscalo en `specs/` probando esas variantes. Si no encuentras coincidencia exacta ni parcial razonable, lista los specs disponibles y pide al usuario que aclare — no adivines.

Confirma en un mensaje corto qué archivo de spec vas a verificar antes de continuar.

## Paso 2 — Invocar al subagente

Invoca el subagente `spec-acceptance-verifier` (tool `Agent`, `subagent_type: "spec-acceptance-verifier"`) con un prompt que incluya explícitamente la ruta resuelta del archivo de spec (ruta relativa desde la raíz del proyecto), y que le indique su tarea tal como está definida en su propio system prompt: verificar cada criterio de aceptación, anotar pass/fail in situ en la spec, reportar el resumen, y escribir `specs/<spec>-fixes.md`.

No hagas tú mismo la verificación ni edites la spec directamente — ese trabajo es exclusivamente del subagente. Tu única responsabilidad en este comando es resolver el archivo correcto y delegarle la tarea completa.

## Paso 3 — Relayar el resultado

Cuando el subagente termine, muestra su reporte al usuario tal cual (el bloque `## Verificación de criterios de aceptación — <spec>` con el conteo y, si aplica, `## Correcciones requeridas`), y menciona la ruta del archivo `specs/<spec>-fixes.md` que generó. No inventes ni resumas de más — si el subagente encontró fallos, esos detalles importan.
