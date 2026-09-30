# Mi agenda · archivos para que sea instalable (PWA)

Estos archivos reemplazan a los actuales en **github.com/ttonguinon/agenda**. Súbelos con **Add file → Upload files → Commit changes**, respetando la carpeta `icons/`.

| Archivo | Qué cambia |
|---|---|
| `manifest.webmanifest` | Agrega `id`, `dir` y `categories`. Lo demás sigue igual. |
| `sw.js` | Versión `mi-agenda-v3`: guarda las copias aunque falle un archivo, también guarda librerías de CDN y responde mejor a las páginas `.html`. |
| `icons/icon-maskable-512.png` | **Corregido**: el calendario quedaba muy ancho y Android le cortaba los bordes al recortarlo en círculo. Ahora tiene margen seguro. |
| `icons/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon-32.png` | Sin cambios; se incluyen para que el paquete esté completo. |

**No hay que tocar `index.html`**: ya trae todo lo necesario.

---

## Lo que ya tiene tu `index.html` (para referencia)

**1. En el `<head>`**

```html
<meta name="theme-color" content="#2E6A5C">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Mi agenda">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
```

**2. Registro del service worker**

```js
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
}
```

**3. Botón "Instalar ahora"**

```js
let deferredPrompt = null;
const isStandalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installNow").hidden = false;
});

document.getElementById("installNow").onclick = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  try { await deferredPrompt.userChoice; } catch (e) {}
  deferredPrompt = null;
  document.getElementById("installNow").hidden = true;
};
```

---

## Cómo instalarla, según el dispositivo

- **Android (Chrome, Edge, Samsung Internet):** aparece el botón **Instalar ahora**, o el menú **⋮ → Instalar aplicación**.
- **Computador (Chrome o Edge):** el ícono **⊕** en la barra de direcciones, o el menú **⋮ → Instalar Mi agenda**.
- **iPhone y iPad:** Safari no ofrece instalación automática. Abre la página en **Safari**, toca **⬆︎ Compartir** y elige **"Agregar a pantalla de inicio"**. Con Chrome o Firefox en iPhone no funciona.

## Si no aparece la opción de instalar

1. Ya está instalada en ese equipo: búscala en la pantalla de inicio o en `chrome://apps`.
2. Estás en modo incógnito o en un navegador que no lo admite.
3. Abriste el archivo descargado en vez de la dirección `https://ttonguinon.github.io/agenda/`.
4. Chrome a veces exige una visita previa antes de ofrecerla.

## Cómo comprobarlo tú mismo

En el computador, con la página abierta: **F12 → pestaña Application → Manifest**. Si dice "Installability: no issues", está lista. En esa misma pestaña, **Service workers** debe mostrar uno **activated and running**.

## Al publicar cambios

- Para actualizar solo la app, sube el `index.html` nuevo: llega solo, porque las páginas se piden primero a internet.
- Si cambias los íconos o el `sw.js`, sube el número: `mi-agenda-v3` → `mi-agenda-v4`. Así los celulares descartan la copia vieja.
