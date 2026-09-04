# Correcciones pendientes — 01-mvp-pantallas

Generado por spec-acceptance-verifier el 2026-09-04. Verificado en la rama `spec-01-mvp-pantallas` (working tree limpio al iniciar).

Sin correcciones pendientes — todos los criterios pasaron el 2026-09-04.

## Verificación realizada

- Estática: `npx tsc --noEmit` sin errores, `npm run lint` sin errores, `npm run build` sin errores (5 rutas generadas: `/`, `/iniciar-sesion`, `/juego/[id]`, `/juego/[id]/jugar`, `/salon-de-la-fama`, `/_not-found`).
- Convenciones Next.js 16: `app/juego/[id]/page.tsx` y `app/juego/[id]/jugar/page.tsx` usan `PageProps<"...">` con `params` async (`await props.params`) y `notFound()`, confirmado contra `node_modules/next/dist/docs/01-app`. `app/layout.tsx` usa `LayoutProps<"/">`.
- Visual con Playwright, comparado pixel a pixel contra `references/templates/Arcade Vault.html` servido localmente (biblioteca en desktop y en viewport móvil 400px, detalle de juego incluyendo leaderboard con los mismos valores exactos por el seed compartido, reproductor con HUD/CRT/arena).
- Interacción funcional verificada en `http://localhost:3000`: buscador y chips de categoría en biblioteca, estado "NO HAY RESULTADOS", navegación tarjeta → detalle, 404 en `/juego/no-existe`, HUD del reproductor incrementando puntuación, pausa/reanudar congela y retoma el incremento, modal "FIN DEL JUEGO" con guardado en `localStorage["av_scores"]` y mensaje "▸ PUNTUACIÓN GUARDADA_" con animación CSS de máquina de escribir (`toast-saved` / `@keyframes typewriter`), botón "SALIR" vuelve a `/juego/[id]`, tabs de auth (Iniciar sesión / Crear cuenta), envío de formulario inicia sesión y redirige a `/`, "Jugar como invitado" navega a `/` sin sesión, nav muestra nombre de usuario tras login y persiste tras recargar (`localStorage["av_user"]`), logout limpia `localStorage["av_user"]`, salón de la fama con podio/tabla/tabs por juego y fila "TU MEJOR MARCA EN …" condicionada a sesión, nav resalta "Biblioteca" también en `/juego/[id]` y `/juego/[id]/jugar`, menú móvil (hamburguesa) abre/cierra panel lateral en viewport de 400px y navega correctamente.

No se encontraron desviaciones respecto a la spec ni al prototipo de referencia.
