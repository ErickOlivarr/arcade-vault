# Correcciones pendientes — 02-home-page

Generado por spec-acceptance-verifier el 2026-09-04. Verificado en la rama `spec-02-home-page` (working tree limpio al momento de verificar).

Sin correcciones pendientes — todos los criterios pasaron el 2026-09-04.

## Evidencia de verificación

- `npm run lint` → sin errores/warnings.
- `npm run build` (Next.js 16.3.4, Turbopack) → compiló sin errores de TypeScript ni ESLint; rutas generadas: `/`, `/iniciar-sesion`, `/juego/[id]`, `/juego/[id]/jugar`, `/juegos`, `/salon-de-la-fama`.
- Revisión de código: `app/page.tsx` renderiza `<Home />`; `app/juegos/page.tsx` renderiza `<Library />`; `components/Home.tsx` porta 1:1 `home.jsx` (hero, features, rail `GAMES.slice(0,6)`, stats, actividad en vivo, precios/FAQ, CTA final) con `router.push` a `/juegos`, `/iniciar-sesion`, `/juego/[id]`, `/salon-de-la-fama` según corresponde.
- `components/Nav.tsx`: "Inicio" (`href="/"`, activo solo en `/`), "Biblioteca" (`href="/juegos"`, activo en `/juegos` y cualquier `/juego/*`), sin link "Acerca de"; réplica idéntica en el panel móvil.
- `components/GameDetail.tsx`, `components/HallOfFame.tsx`, `components/GamePlayer.tsx` (botón "VOLVER AL VAULT" del modal de fin de juego, línea 133) y `components/Auth.tsx` (submit y "Jugar como invitado") apuntan a `/juegos`.
- `components/GamePlayer.tsx` línea 65 ("SALIR" del HUD) sigue apuntando a `/juego/${game.id}`, sin cambios.
- `app/globals.css` contiene el bloque `/* ===== HOME PAGE ===== */` con selectores `.home*`, `.feature-grid`, `.mini-rail`, `.stat-block`, `.home-final*`, `.reveal`/`.reveal.in`, `.activity-grid`/`.ac-head`/`.ticker`/`.tick-row`/`.top-list`/`.top-row`, `.pricing-grid`/`.price-card`/`.pc-*`/`.faq-item`, y los keyframes `float`, `pulse-led`, `tickin` (el keyframe `gridscroll` ya existía y se reutiliza).
- Verificación visual con Playwright (desktop 1440×900 y móvil 390×844, con scroll forzado para disparar `IntersectionObserver`/`.reveal.in`): hero, 4 features, rail de 6 juegos, 3 stats, ticker de actividad + top 5, tarjeta de precio + 3 FAQ, y CTA final se ven y comportan igual que `references/templates/home-about/home.jsx`/`styles.css`. Menú móvil hamburguesa muestra "Inicio" (activo) y "Biblioteca" apuntando a `/` y `/juegos`.
- Navegación funcional probada en vivo (no solo lectura de código): clic en "EXPLORAR JUEGOS" → `/juegos`; clic en tarjeta "BLOQUE BUSTER" del rail → `/juego/bloque-buster`; clic en "VOLVER AL VAULT" del modal de fin de partida (tras "FIN" en `/juego/bloque-buster/jugar`) → `/juegos`; nav resalta "Biblioteca" en `/juegos`, `/juego/bloque-buster` y `/juego/bloque-buster/jugar`.

No se detectaron desviaciones respecto a los criterios de aceptación de la spec. El campo `**Estado:**` de la spec sigue en `Aprobado`; el usuario decide si corresponde actualizarlo a `Implementado` con esta verificación como respaldo.
