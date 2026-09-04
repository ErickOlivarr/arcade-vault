# 02 — Home page

**Estado:** Aprobado
**Depende de:** SPEC 01
**Fecha:** 2026-09-04

**Objetivo:** Implementar la landing page (`home.jsx` del prototipo en `references/templates/home-about/`) como la nueva ruta raíz `/`, moviendo la Biblioteca actual a `/juegos` y actualizando el nav y los enlaces internos en consecuencia.

## Alcance

**Incluye:**
- Migración 1:1 de la UI y el CSS de `references/templates/home-about/home.jsx` (hero, sección "por qué Arcade Vault", preview de juegos, stats, actividad en vivo, precios/FAQ, CTA final) a un componente React/TypeScript.
- Nueva ruta `/` que renderiza esta landing (reemplaza a la Biblioteca actual en esa ruta).
- Mover la Biblioteca actual (todo lo que hoy vive en `app/page.tsx`) a la nueva ruta `/juegos`, sin cambios de UI/comportamiento respecto a la spec 01.
- Actualizar `components/Nav.tsx` para agregar el link "Inicio" (apunta a `/`) y renombrar el destino del link "Biblioteca" a `/juegos`, tanto en el nav de escritorio como en el panel móvil.
- Actualizar todos los enlaces/redirects internos que hoy apuntan a `/` asumiendo que es la Biblioteca, para que apunten a `/juegos`:
  - `components/GameDetail.tsx` — botón "VOLVER AL VAULT".
  - `components/HallOfFame.tsx` — botón "volver a biblioteca".
  - `components/GamePlayer.tsx` — botón "VOLVER AL VAULT" del modal de fin de juego.
  - `components/Auth.tsx` — redirect tras enviar el formulario y tras "Jugar como invitado".
- Agregar al `app/globals.css` el bloque de estilos "HOME PAGE" de `references/templates/home-about/styles.css` (clases `.home*`, `.feature-grid`, `.mini-rail`, `.stat-block`, `.home-final`, `.reveal`/`.reveal.in`, las clases de "actividad en vivo" `.activity-grid`/`.ac-head`/`.ticker`/`.tick-row`/`.top-list`/`.top-row`/etc. y de "precios/FAQ" `.pricing-grid`/`.price-card`/`.pc-*`/`.faq-item`/etc., y los keyframes `float`, `pulse-led` y `tickin` que faltan — `gridscroll` ya existe y se reutiliza).
- Animación de aparición al hacer scroll (`useReveal`, `IntersectionObserver` + clase `.reveal`/`.in`) igual que en el prototipo.
- Siluetas SVG flotantes decorativas del hero (`FloatingSilhouettes`) e íconos de features (`FeatureIcon`), portados tal cual.
- El rail de "juegos disponibles ahora" usa `GAMES.slice(0, 6)` de `app/data/games.ts` (dato real ya existente); las secciones de "actividad en vivo" (ticker de puntuaciones recientes y top jugadores de hoy) y "precios/FAQ" usan los mismos arreglos estáticos hardcodeados del prototipo (no vienen de `app/data/`), igual que en `home.jsx`.

**No incluye:**
- La pantalla "Acerca de" (`about.jsx`) — queda para una spec futura. El link "Acerca de" del nav del prototipo **no** se agrega todavía, para no dejar un enlace roto.
- Cualquier dato real detrás de las secciones de actividad en vivo, stats o precios (siguen siendo contenido estático de ejemplo, como en el prototipo).
- Cambios al comportamiento o UI de la Biblioteca en sí (`components/Library.tsx`, `components/GameCard.tsx`) más allá de moverla de ruta.
- Cambiar el destino del botón "SALIR" del HUD en `components/GamePlayer.tsx`: nunca apuntó a `/` (siempre navegó a `/juego/[id]`), así que no aplica el criterio de "enlaces que asumían `/` = Biblioteca"; se mantiene igual, comportamiento ya validado en `specs/01-mvp-pantallas.md`.
- Tests automatizados (no hay suite configurada en el proyecto).

## Modelo de datos

No se introduce ningún dato nuevo. La sección "juegos disponibles ahora" reutiliza `GAMES` de `app/data/games.ts` (spec 01). El resto del contenido de Home (features, stats, ticker de actividad, top jugadores, precios, FAQ) es texto/arreglos estáticos definidos dentro de `components/Home.tsx`, portados tal cual del prototipo.

## Plan de implementación

1. **CSS de Home:** agregar a `app/globals.css` el bloque "HOME PAGE" de `references/templates/home-about/styles.css` (selectores `.home`, `.home-hero*`, `.hero-eyebrow`, `.home-title*`, `.home-sub`, `.home-ctas`, `.hero-scroll`, `.home-silos*`, `.home-section`, `.section-head`, `.section-title`, `.section-rule`, `.feature-grid`, `.feature-card*`, `.mini-rail`, `.mini-card*`, `.mini-cover`, `.mini-meta`, `.mini-title`, `.mini-cat`, `.home-stats*`, `.stats-inner`, `.stat-block`, `.stat-n`, `.stat-u`, `.stat-s`, `.home-final*`, `.final-title`, `.final-cta`, `.final-tag`, `.reveal`/`.reveal.in`, `.activity-grid`, `.activity-card`, `.ac-head`, `.ac-title`, `.live-led`, `.lb-link`, `.ticker`, `.tick-row`, `.tk-p`, `.tk-mid`, `.tk-s`, `.tk-t`, `.top-list`, `.top-row`, `.tp-rk`, `.tp-p`, `.tp-s`, `.tp-bar`, `.pricing-grid`, `.price-card*`, `.pc-*`, `.pricing-faq`, `.faq-item`, `.faq-q`, `.faq-a`) junto con los keyframes `float`, `pulse-led` y `tickin` (el keyframe `gridscroll` que usa `.home-silos`/`.game-arena` ya existe en el archivo y no se duplica).
   - *Prueba:* `npm run build` compila sin errores; las rutas existentes (`/`, `/juego/[id]`, etc.) no cambian visualmente todavía porque las clases nuevas aún no se usan en ningún componente.
2. **Componente Home:** crear `components/Home.tsx` (`"use client"` por el `useReveal`/`IntersectionObserver`) portado de `home.jsx`: `FloatingSilhouettes`, `MiniCard`, `FeatureIcon` y el componente `Home` con sus 6 secciones (hero, why, games preview, stats, actividad en vivo, precios+FAQ, CTA final). Los `navigate(...)` del prototipo se traducen a `<Link>`/`useRouter` de Next: "biblioteca" → `/juegos`, "auth" → `/iniciar-sesion`, "detalle" → `/juego/[id]`, "salon" → `/salon-de-la-fama`. El rail de juegos usa `GAMES.slice(0, 6)` de `app/data/games.ts`.
   - *Prueba:* con `Home` montado temporalmente en cualquier ruta de prueba, el hero, las 4 tarjetas de features, el rail de 6 juegos, los 3 bloques de stats, el ticker de actividad, el top 5 de jugadores, la tarjeta de precio y las 3 FAQ se ven correctamente; al hacer scroll, las secciones con clase `reveal` aparecen con la animación (se les agrega `in`).
3. **Mover Biblioteca a `/juegos`:** crear `app/juegos/page.tsx` con el mismo contenido que tenía `app/page.tsx` (`return <Library />;`). Reemplazar `app/page.tsx` para que renderice `<Home />`.
   - *Prueba:* `npm run dev`; `/` muestra la nueva landing; `/juegos` muestra exactamente la Biblioteca que antes vivía en `/` (buscador, chips, grid de 8 juegos, estado "NO HAY RESULTADOS").
4. **Nav:** en `components/Nav.tsx`, agregar el link "Inicio" (`href="/"`, activo solo en `pathname === "/"`) antes de "Biblioteca"; cambiar el `href` de "Biblioteca" a `/juegos` y su lógica `isActive` para que se resalte en `/juegos`, `/juego/[id]` y `/juego/[id]/jugar`. Replicar los mismos cambios en el panel móvil. El logo sigue enlazando a `/`.
   - *Prueba:* en `/`, el nav resalta "Inicio"; en `/juegos`, `/juego/<id>` y `/juego/<id>/jugar`, el nav resalta "Biblioteca"; el menú móvil (<840px) muestra "Inicio" y "Biblioteca" apuntando a las rutas correctas.
5. **Actualizar enlaces internos que asumían `/` = Biblioteca:** cambiar a `/juegos` en `components/GameDetail.tsx` (botón "VOLVER AL VAULT"), `components/HallOfFame.tsx` (botón "volver a biblioteca"), `components/GamePlayer.tsx` (botón "VOLVER AL VAULT" del modal de fin de juego — `router.push`), y `components/Auth.tsx` (`router.push` tras enviar el formulario y tras "Jugar como invitado"). El botón "SALIR" del HUD en `GamePlayer.tsx` no se toca: sigue navegando a `/juego/[id]`, igual que en la spec 01.
   - *Prueba:* desde `/juego/<id>`, "VOLVER AL VAULT" navega a `/juegos`; desde `/salon-de-la-fama`, "volver a biblioteca" navega a `/juegos`; desde el reproductor, al terminar una partida "VOLVER AL VAULT" (modal) navega a `/juegos` y "SALIR" (HUD) sigue navegando a `/juego/[id]`; en `/iniciar-sesion`, enviar el formulario y "Jugar como invitado" navegan a `/juegos`.
6. **Verificación final:** `npm run lint` y `npm run build` sin errores; recorrido manual de `/` y `/juegos` en `npm run dev` (desktop y ancho móvil) comparando `/` visualmente contra `home.jsx`/`styles.css` de `references/templates/home-about/`.
   - *Prueba:* `npm run lint` y `npm run build` terminan en verde; `/` se ve visualmente equivalente al prototipo Home en desktop y en un viewport móvil (DevTools responsive); todas las rutas existentes de la spec 01 siguen funcionando desde sus nuevas ubicaciones.

## Criterios de aceptación

- [ ] `npm run build` compila sin errores de TypeScript ni de ESLint.
- [ ] `/` muestra la landing (hero con siluetas flotantes y CTAs, sección "por qué Arcade Vault" con 4 features, rail de 6 juegos, 3 bloques de stats, actividad en vivo con ticker y top 5, precios con FAQ, CTA final) con la animación de aparición al hacer scroll.
- [ ] En el hero de `/`, "EXPLORAR JUEGOS" navega a `/juegos` y "CREAR CUENTA" navega a `/iniciar-sesion`.
- [ ] Click en una tarjeta del rail de juegos navega a `/juego/[id]` correcto; "VER TODOS LOS JUEGOS →" navega a `/juegos`.
- [ ] "VER SALÓN →" en la tarjeta de top jugadores navega a `/salon-de-la-fama`; "EMPEZAR GRATIS →" e "INSERTAR MONEDA →" navegan a `/iniciar-sesion` y `/juegos` respectivamente (igual que el prototipo: precio → auth, CTA final → biblioteca).
- [ ] `/juegos` muestra la Biblioteca completa (buscador, chips de categoría, grid de 8 juegos, estado "NO HAY RESULTADOS"), idéntica a la que antes vivía en `/`.
- [ ] El nav muestra "Inicio" y "Biblioteca"; "Inicio" resalta solo en `/`; "Biblioteca" resalta en `/juegos`, `/juego/[id]` y `/juego/[id]/jugar`. El link "Acerca de" no está presente todavía.
- [ ] "VOLVER AL VAULT" en detalle de juego, "volver a biblioteca" en salón de la fama y "VOLVER AL VAULT" en el modal de fin de juego del reproductor navegan a `/juegos`.
- [ ] "SALIR" en el HUD del reproductor sigue navegando a `/juego/[id]` (sin cambios respecto a la spec 01).
- [ ] En `/iniciar-sesion`, enviar el formulario y "Jugar como invitado" navegan a `/juegos` (en vez de `/`).
- [ ] El menú móvil (hamburguesa, <840px) incluye "Inicio" y "Biblioteca" apuntando a las rutas correctas.
- [ ] La apariencia visual de `/` (tipografías pixel/mono, gradientes de título, siluetas flotantes, efectos neón, animaciones) coincide con `home.jsx`/`styles.css` de `references/templates/home-about/` en desktop y en móvil.

## Decisiones tomadas y descartadas

- **Biblioteca se mueve a `/juegos` (no `/biblioteca`):** decisión explícita del usuario; evita cualquier ambigüedad de prefijo con las rutas ya existentes `/juego/[id]` y `/juego/[id]/jugar`.
- **`/` pasa a ser Home, no una ruta nueva como `/inicio`:** decisión explícita del usuario, replicando que en el prototipo "home" es la pantalla inicial del router por hash.
- **Todos los enlaces que antes asumían `/` = Biblioteca se actualizan a `/juegos` (detalle, salón, modal de fin de juego, login):** decisión explícita del usuario — preserva el comportamiento funcional original (volver al listado de juegos) en vez de heredar un cambio de destino no intencional hacia la nueva Home.
- **El botón "SALIR" del HUD en `GamePlayer.tsx` NO se actualiza a `/juegos`:** corrección tras detectar que ese botón nunca apuntó a `/` — siempre navegó a `/juego/[id]`, comportamiento ya validado en `specs/01-mvp-pantallas.md`. La versión original de esta spec asumía incorrectamente que también debía cambiar; se corrigió el Paso 5 y el criterio de aceptación correspondiente.
- **El botón "VOLVER AL VAULT" del modal de fin de juego en `GamePlayer.tsx` se agrega a la lista de enlaces a actualizar:** no estaba en el alcance original pese a asumir `/` = Biblioteca; se agregó al Alcance y al Paso 5 por decisión explícita del usuario.
- **El CSS de "actividad en vivo" y "precios/FAQ" se incluye explícitamente en el Paso 1:** el Alcance original ya exigía portar esas secciones con paridad visual, pero la lista de selectores del Paso 1 no las incluía; se corrigió para que el Paso 1 quede completo.
- **El link "Acerca de" no se agrega al nav en esta spec:** decisión explícita del usuario — la pantalla `about.jsx` queda fuera de alcance, y agregar el link ahora dejaría un enlace roto (404) hasta que exista esa spec.
- **Solo se implementa Home en esta spec, no About:** aunque ambas viven en la misma carpeta `references/templates/home-about/`, el usuario confirmó que About se maneja en una spec separada.
- **Contenido estático de actividad/precios se porta tal cual, sin conectarlo a datos reales:** consistente con que este es un MVP visual (spec 01) y con que el propio prototipo usa arreglos hardcodeados en estas secciones.
