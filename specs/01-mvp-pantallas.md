# 01 — MVP: pantallas visuales de Arcade Vault

**Estado:** Aprobado
**Depende de:** Ninguno
**Fecha:** 2026-09-03

**Objetivo:** Implementar visualmente, con rutas reales de Next.js App Router, las cinco pantallas del prototipo de referencia (`references/templates/`) — biblioteca, detalle de juego, reproductor placeholder, autenticación y salón de la fama — sin implementar ningún juego real.

## Alcance

**Incluye:**
- Migración 1:1 de la UI y el CSS del prototipo (`references/templates/*.jsx` + `styles.css`) a componentes de React/TypeScript en `05-arcade-vault`. `app/globals.css` ya contiene el tema portado (colores, tipografías, animaciones) de un trabajo previo — se reutiliza y solo se agrega lo que falte.
- 5 rutas reales de App Router con navegación por `<Link>`/`useRouter`, en español, igual que el prototipo:
  - `/` — Biblioteca (grid de juegos, buscador, filtro por categoría)
  - `/juego/[id]` — Detalle del juego + leaderboard ficticio
  - `/juego/[id]/jugar` — Reproductor: pantalla placeholder de partida simulada (HUD, arena CRT decorativa, puntuación auto-incremental, pausa, modal de fin de juego con guardado de puntuación). Se copia tal cual del prototipo — es el hueco donde más adelante se montará el juego real.
  - `/iniciar-sesion` — Login/registro simulados (sin backend, cualquier usuario entra)
  - `/salon-de-la-fama` — Tabla de mejores puntuaciones por juego (podio + tabla), con pestañas por juego
- Nav superior fijo + panel móvil, igual que el prototipo, viviendo en `app/layout.tsx` para persistir entre rutas.
- Datos ficticios en `app/data/` (juegos, jugadores, generador de puntuaciones seed), tipados con TypeScript estricto, con un comentario indicando que eventualmente vendrán de una base de datos.
- Sesión de usuario simulada y puntuaciones guardadas en `localStorage`, igual que el prototipo (`av_user`, `av_scores`), compartidas entre rutas mediante un contexto de React en el layout.
- Estados vacíos/interactivos ya presentes en el prototipo: "sin resultados" en biblioteca, tabs activos, hover/tilt de tarjetas, animaciones de neón/scanlines.
- Responsive tal cual los breakpoints definidos en `globals.css`.

**No incluye:**
- Ningún juego jugable real (el "reproductor" sigue siendo la simulación decorativa del prototipo, no un juego).
- Backend, base de datos, autenticación real, validación de formularios o API routes.
- Persistencia real de puntuaciones más allá de `localStorage` (no se muestran los puntajes guardados por el usuario en ninguna tabla; el prototipo tampoco lo hace).
- Sistema de créditos/monedas funcional (el contador "CRÉDITOS · 03" del nav es decorativo, como en el prototipo).
- Login social (Google/GitHub) funcional — los botones son decorativos, como en el prototipo.
- Tests automatizados (no hay suite configurada en el proyecto).

## Modelo de datos

Todo vive en `app/data/games.ts` (datos, no ruta — Next.js lo ignora porque no tiene `page.tsx`), portado desde `references/templates/data.jsx` con tipos TypeScript:

```ts
export type GameCategory = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";

export interface Game {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: GameCategory;
  cover: string; // clase CSS de portada, p.ej. "cover-bricks"
  color: "cyan" | "magenta" | "yellow" | "green";
  best: number;
  plays: string;
}

export interface ScoreRow {
  rank: number;
  name: string;
  score: number;
  date: string;
}

export const GAMES: Game[];
export const CATS: readonly ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"];
export const PLAYERS: string[];
export function seededScores(seed: number, count?: number): ScoreRow[];
```

Sesión de usuario y puntuaciones (no son "datos ficticios" sino estado runtime en `localStorage`):
```ts
// lib/user-context.tsx
export interface User { name: string; }
// UserProvider expone: { user: User | null, login(u: User | null): void, logout(): void }
// persiste en localStorage bajo la clave "av_user"

// lib/scores.ts
export interface ScoreEntry { game: string; score: number; name: string; }
export function saveScore(entry: ScoreEntry): void;
// agrega { ...entry, at: Date.now() } al arreglo en localStorage bajo "av_scores"
```

## Plan de implementación

1. **Datos base:** crear `app/data/games.ts` con `GAMES`, `CATS`, `PLAYERS` y `seededScores` portados desde `data.jsx`, tipados.
   - *Prueba:* `npm run build` (o `tsc --noEmit`) compila sin errores de tipos; un `console.log(GAMES.length)` temporal en un script/REPL de Node con `tsx` devuelve 8.
2. **Sesión compartida:** crear `lib/user-context.tsx` (`"use client"`) con `UserProvider` + hook `useUser()` que lee/escribe `localStorage["av_user"]`. Crear `lib/scores.ts` con `saveScore()`.
   - *Prueba:* con `UserProvider` montado en un componente de prueba temporal (o directamente en el paso 3), llamar `login({name:"TEST"})` y ver en DevTools → Application → Local Storage que aparece la clave `av_user` con `{"name":"TEST"}`.
3. **Nav global:** crear `components/Nav.tsx` (`"use client"`, usa `usePathname()` para resaltar el link activo y `useUser()` para mostrar nombre/login/logout) y `components/MobilePanel` si se separa. Montar `<UserProvider>` + `<Nav />` + footer en `app/layout.tsx`, alrededor de `{children}`.
   - *Prueba:* `npm run dev`, abrir `/` — el nav aparece en todas las rutas existentes (aunque aún den 404), el botón "Iniciar Sesión" se muestra por defecto, y al angostar la ventana bajo 840px aparece el botón hamburguesa que abre el panel móvil.
4. **Biblioteca (`/`):** crear `components/Library.tsx` y `components/GameCard.tsx` (`"use client"` por el buscador, filtro y tilt de mouse) portados de `biblioteca.jsx`. `app/page.tsx` los renderiza.
   - *Prueba:* en `/`, escribir en el buscador filtra las tarjetas en tiempo real, los chips de categoría filtran el grid, y buscar un texto sin resultados muestra "NO HAY RESULTADOS".
5. **Detalle (`/juego/[id]`):** crear `components/GameDetail.tsx` portado de `detalle.jsx` (puede ser server component; los botones son `<Link>`). `app/juego/[id]/page.tsx` resuelve `id` de los params, busca el juego en `GAMES` y llama `notFound()` si no existe.
   - *Prueba:* click en una tarjeta de la biblioteca navega a `/juego/<id>` con portada, descripción y leaderboard de 10 filas correctos; visitar `/juego/no-existe` muestra la página 404.
6. **Reproductor (`/juego/[id]/jugar`):** crear `components/GamePlayer.tsx` (`"use client"`, con los mismos `setInterval`/estado de `reproductor.jsx`) que llama a `saveScore()` y usa `useUser()` para el nombre por defecto. `app/juego/[id]/jugar/page.tsx` resuelve el juego o `notFound()`.
   - *Prueba:* al entrar, la puntuación sube sola; "PAUSA" la detiene y "REANUDAR" la retoma; "FIN" abre el modal, y al guardar la puntuación aparece en `localStorage["av_scores"]` (DevTools) y el mensaje de confirmación con efecto de máquina de escribir.
7. **Auth (`/iniciar-sesion`):** crear `components/Auth.tsx` (`"use client"`) portado de `auth.jsx`, usando `useUser().login()` y `useRouter().push("/")` tras enviar el formulario o entrar como invitado.
   - *Prueba:* enviar el formulario con cualquier dato redirige a `/` y el nav ya muestra el nombre de usuario en mayúsculas; recargar la página mantiene la sesión (persistida en `localStorage`); "Jugar como invitado" navega a `/` sin sesión.
8. **Salón de la fama (`/salon-de-la-fama`):** crear `components/HallOfFame.tsx` (`"use client"`, tabs por juego) portado de `salon.jsx`, usando `useUser()` para la fila "tu mejor marca".
   - *Prueba:* cambiar entre pestañas de juego actualiza podio y tabla; con sesión iniciada aparece la fila "TU MEJOR MARCA EN…"; sin sesión, esa fila no aparece.
9. **Verificación final:** `npm run lint` y `npm run build` sin errores; recorrido manual de las 5 rutas en `npm run dev` (desktop y ancho móvil) comparando contra `references/templates/Arcade Vault.html` como referencia visual.
   - *Prueba:* `npm run lint` y `npm run build` terminan en verde; las 5 rutas se ven visualmente equivalentes a `Arcade Vault.html` abierto en el navegador, en desktop y en un viewport móvil (DevTools responsive).

## Criterios de aceptación

- [ ] `npm run build` compila sin errores de TypeScript ni de ESLint.
- [ ] `/` muestra el grid de 8 juegos, el buscador filtra por título en tiempo real y los chips filtran por categoría; buscar algo inexistente muestra el estado "NO HAY RESULTADOS".
- [ ] Click en una tarjeta o en "JUGAR" navega a `/juego/[id]` con la información correcta del juego (portada, descripción, tags, stats, leaderboard de 10 filas).
- [ ] `/juego/[id]` con un id inexistente muestra la página 404 de Next.js.
- [ ] "JUGAR AHORA" navega a `/juego/[id]/jugar`, donde el HUD muestra puntuación subiendo automáticamente, el botón de pausa detiene/reanuda el incremento, y "FIN" abre el modal de fin de partida con la puntuación final.
- [ ] Guardar la puntuación en el modal la persiste en `localStorage["av_scores"]` y muestra el mensaje de confirmación con efecto de máquina de escribir.
- [ ] "SALIR" desde el reproductor vuelve a `/juego/[id]`.
- [ ] `/iniciar-sesion` permite alternar entre "Iniciar sesión" y "Crear cuenta", enviar el formulario con cualquier dato inicia sesión y redirige a `/`, y "Jugar como invitado" navega a `/` sin usuario.
- [ ] Tras iniciar sesión, el nav (visible en cualquier ruta) muestra el nombre de usuario en vez del botón "Iniciar Sesión", y persiste tras recargar la página (por `localStorage`).
- [ ] Cerrar sesión desde el nav limpia `localStorage["av_user"]` y vuelve a mostrar "Iniciar Sesión".
- [ ] `/salon-de-la-fama` muestra podio (top 3) y tabla por cada juego seleccionable en las pestañas; con sesión iniciada aparece la fila "tu mejor marca".
- [ ] El nav resalta el link activo correctamente en las 5 rutas (incluyendo detalle/reproductor resaltando "Biblioteca").
- [ ] El menú móvil (hamburguesa) abre/cierra el panel lateral por debajo de 840px de ancho y permite navegar a las mismas rutas.
- [ ] La apariencia visual (colores, tipografías pixel/mono, efectos neón, scanlines, CRT) coincide con `references/templates/Arcade Vault.html` en desktop y en móvil.

## Decisiones tomadas y descartadas

- **Rutas reales de App Router en vez de router por hash:** el proyecto ya es Next.js 16 App Router; usar rutas reales es más idiomático, da URLs compartibles y evita replicar un router casero. Se descarta imitar `location.hash` del prototipo.
- **`localStorage` para sesión y puntuaciones, tal cual el prototipo:** es un MVP solo visual, sin backend. Se acepta login falso (cualquier credencial entra) y puntuaciones que se guardan pero no se vuelven a leer en ninguna tabla (igual que en el prototipo).
- **Reproductor copiado tal cual como placeholder:** el usuario confirmó que es intencionalmente un placeholder temporal donde después se montará el juego real; no se simplifica ni se le quita la simulación por temporizador.
- **`app/data/games.ts` en vez de una carpeta `lib/`:** decisión explícita del usuario, anticipando que ahí vivirán los datos que eventualmente vendrán de una base de datos.
- **Estado de sesión vía React Context en el layout, no vía relectura de `localStorage` en cada página:** como `Nav` vive en `app/layout.tsx` y los layouts no se remontan entre rutas, se necesita un `UserProvider` compartido para que el nav reaccione a login/logout hechos en `/iniciar-sesion` sin recargar la página.
- **Slugs de ruta en español:** consistencia con el resto de la copy de la app (ya en español) y con la nomenclatura del prototipo.
- **Componentes en `components/` en la raíz, páginas delgadas:** separa UI de routing y sigue la convención común de Next.js App Router.
