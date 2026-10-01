# Mi agenda — Planificador con alarmas

Aplicación web instalable (PWA) para organizar actividades: calendario mensual, alarmas programables, festivos de Colombia, vista por mes, exportación a Excel e importación de la programación CO3.

## Funciones

- Calendario mensual con domingos, sábados y festivos de Colombia en rojo (configurable en ⚙ Ajustes).
- Actividades con fecha, hora, lugar, "con quién", categoría, repetición, notas y alarma.
- Alarmas con sonido, vibración y aviso del navegador (suenan mientras la app esté abierta).
- Vista "Por mes" y lista desplegable de los próximos 7 días.
- Exportación a Excel con resumen, hoja por mes y respaldo; importación del respaldo o de la programación CO3.
- Funciona sin internet una vez instalada. Los datos se guardan solo en el dispositivo.

## Estructura

```
index.html              La aplicación
manifest.webmanifest    Datos para instalarla como app
sw.js                   Service worker (funcionamiento sin conexión)
libs/xlsx.full.min.js   SheetJS 0.18.5 (lectura y escritura de Excel)
icons/                  Íconos de la app
.nojekyll               Evita que GitHub Pages procese los archivos
```

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `mi-agenda`), público.
2. Pulsa **Add file › Upload files**, arrastra todo el contenido de esta carpeta (no la carpeta en sí) y confirma con **Commit changes**.
3. Ve a **Settings › Pages**. En *Source* elige **Deploy from a branch**, rama **main** y carpeta **/ (root)**. Guarda.
4. En uno o dos minutos la app estará en `https://TU-USUARIO.github.io/mi-agenda/`.

## Instalar en el celular

- **Android (Chrome):** abre el enlace y pulsa **Instalar** en la tarjeta de la app, o menú ⋮ › **Instalar app**.
- **iPhone (Safari):** botón Compartir › **Agregar a inicio**.
- **Computador (Chrome o Edge):** ícono de instalar en la barra de direcciones.

## Publicar una actualización

1. Reemplaza `index.html` (y los demás archivos que cambien) en el repositorio.
2. En `sw.js` sube el número de versión, por ejemplo `mi-agenda-v1` → `mi-agenda-v2`, para que los celulares descarguen la nueva versión.

## Importante

- Los datos quedan en el navegador de cada dispositivo. Exporta a Excel de vez en cuando como respaldo; con **Importar** puedes pasarlos a otro equipo.
- Si cambias el nombre del repositorio o la dirección, los datos guardados en la dirección anterior no se trasladan solos: exporta antes y vuelve a importar.
- Las alarmas de una página web solo suenan con la app abierta (en primer plano o en una pestaña activa).
