# Cómo ver la página sin escribir en la terminal

## Opción 1: Tarea de Cursor (recomendada)

1. Pulsa **Cmd + Shift + P** (Mac) o **Ctrl + Shift + P** (Windows) para abrir la paleta de comandos.
2. Escribe: **Run Task** (o "Ejecutar tarea").
3. Elige la tarea **"Iniciar servidor (dev)"** y pulsa Enter.
4. Se abrirá una terminal y se ejecutará el servidor automáticamente (no tienes que escribir nada).
5. Cuando veas en esa terminal algo como `Local: http://localhost:5173/`, abre **Chrome** y en la barra de direcciones escribe: **http://localhost:5173**
6. No cierres la pestaña de la terminal donde está corriendo el servidor.

## Opción 2: Menú Terminal

- Menú **Terminal** → **Run Task...** → **Iniciar servidor (dev)**. Luego abre en Chrome: **http://localhost:5173**

---

Si al ejecutar la tarea sale **"npm no se reconoce"** o **"command not found"**, entonces Node.js no está instalado en tu Mac. Instálalo desde [https://nodejs.org](https://nodejs.org) (versión LTS) y vuelve a intentar la tarea.
