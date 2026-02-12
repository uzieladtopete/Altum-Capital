# Guía paso a paso: subir tu página a Render (principiante)

Sigue estos pasos en orden. No te saltes ninguno.

---

## Parte 1: Tener tu código en GitHub

Render necesita que tu proyecto esté en **GitHub** para poder leerlo y desplegarlo.

### Paso 1.1 – Crear una cuenta en GitHub (si no tienes)

1. Entra a [github.com](https://github.com).
2. Haz clic en **Sign up** y crea tu cuenta.
3. Verifica tu email si te lo piden.

### Paso 1.2 – Instalar Git en tu computadora (si no lo tienes)

- **Mac:** Abre Terminal y escribe: `git --version`  
  - Si sale un número de versión, ya está instalado.  
  - Si dice "command not found", instala Git: [git-scm.com/download/mac](https://git-scm.com/download/mac) o con Homebrew: `brew install git`.
- **Windows:** Descarga e instala desde [git-scm.com/download/win](https://git-scm.com/download/win).

### Paso 1.3 – Crear un repositorio nuevo en GitHub

1. Entra a [github.com](https://github.com) e inicia sesión.
2. Arriba a la derecha haz clic en el **+** → **New repository**.
3. **Repository name:** por ejemplo `Altum-Capital` (o el nombre que quieras).
4. Deja **Public**.
5. **No** marques "Add a README" ni "Add .gitignore" (ya tienes archivos en tu carpeta).
6. Haz clic en **Create repository**.

Te saldrá una página con instrucciones; no cierres esa pestaña, la usarás en el siguiente paso.

### Paso 1.4 – Subir tu proyecto desde la carpeta del proyecto

1. Abre la **Terminal** (Mac) o **Git Bash** (Windows).
2. Ve a la carpeta de tu proyecto:
   ```bash
   cd /Users/uzielad/Documents/Altum-Capital
   ```
3. Inicializa Git (solo la primera vez):
   ```bash
   git init
   ```
4. Añade todos los archivos:
   ```bash
   git add .
   ```
5. Primer guardado (commit):
   ```bash
   git commit -m "Primera subida del proyecto"
   ```
6. Conecta tu carpeta con el repositorio de GitHub (cambia `TU-USUARIO` por tu usuario de GitHub y `Altum-Capital` si usaste otro nombre):
   ```bash
   git remote add origin https://github.com/TU-USUARIO/Altum-Capital.git
   ```
7. Sube el código a GitHub:
   ```bash
   git branch -M main
   git push -u origin main
   ```
   Te pedirá usuario y contraseña. En GitHub ya no se usa contraseña normal; usa un **Personal Access Token**:
   - GitHub → **Settings** (tu perfil) → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**.
   - Dale un nombre, marca **repo** y genera. Copia el token.
   - Cuando `git push` pida "Password", pega ese token (no tu contraseña de GitHub).

Cuando termine sin errores, en la página del repo en GitHub deberías ver todos tus archivos. **Parte 1 lista.**

---

## Parte 2: Conectar Render con GitHub y crear el sitio

### Paso 2.1 – Entrar a Render

1. Entra a [render.com](https://render.com) e inicia sesión con la cuenta que creaste.
2. Si te ofrece "Sign up with GitHub", úsalo; así Render podrá ver tus repositorios.

### Paso 2.2 – Crear un Static Site (sitio estático)

1. En el panel de Render haz clic en **New +** (arriba).
2. Elige **Static Site** (no Web Service ni Background Worker).

### Paso 2.3 – Conectar el repositorio de GitHub

1. En **Connect a repository** te saldrán tus repos de GitHub.
2. Busca **Altum-Capital** (o el nombre que pusiste) y haz clic en **Connect**.
3. Si no aparece, haz clic en **Configure account** o **Adjust GitHub permissions** y autoriza a Render para ver tus repositorios; luego vuelve y conecta **Altum-Capital**.

### Paso 2.4 – Configurar el Static Site

Rellena así (copia tal cual):

| Campo | Valor |
|-------|--------|
| **Name** | `altum-capital` (o el que quieras; será parte de la URL) |
| **Branch** | `main` |
| **Root Directory** | Déjalo **vacío** |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

- **Build Command:** le dice a Render que instale dependencias y genere la carpeta de producción.
- **Publish Directory:** le dice que la página que debe servir está en la carpeta `dist`.

No hace falta tocar **Environment** (variables de entorno) por ahora.

### Paso 2.5 – Crear el deploy

1. Haz clic en **Create Static Site** (abajo).
2. Render empezará a hacer el **build** (instalar y compilar). Verás logs en pantalla.
3. Espera unos minutos. Si todo va bien, al final dirá **Live** o **Deploy live** y te dará una URL como:
   ```text
   https://altum-capital.onrender.com
   ```
4. Haz clic en esa URL y deberías ver tu página en vivo.

**Parte 2 lista.**

---

## Parte 3: Cambios futuros (cada vez que quieras actualizar la página)

1. Edita tu código como siempre en tu computadora.
2. En la Terminal, desde la carpeta del proyecto:
   ```bash
   cd /Users/uzielad/Documents/Altum-Capital
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```
3. Render detecta el nuevo `git push` y hace un **deploy automático**. En el panel de Render verás un nuevo deploy; cuando pase a **Live**, la URL tendrá los cambios.

---

## Resumen rápido

1. **GitHub:** proyecto subido con `git init`, `git add .`, `git commit`, `git remote`, `git push`.
2. **Render:** New → Static Site → conectar repo → Build: `npm install && npm run build` → Publish: `dist` → Create Static Site.
3. **Actualizar:** `git add .` → `git commit` → `git push` y Render vuelve a desplegar solo.

---

## Si algo falla

- **"Build failed" en Render:** Mira el log (clic en el deploy). Lo más común es un error en el código o que falte algo en `package.json`. Revisa que localmente `npm run build` funcione sin errores.
- **Página en blanco:** Revisa que en **Publish Directory** esté exactamente `dist` (minúsculas). En Vite, la carpeta de build es `dist`.
- **No me deja conectar GitHub:** En GitHub → Settings del repo → asegúrate de que Render tenga acceso; en Render, en account settings, revisa la conexión con GitHub.

Cuando tengas la URL de Render (por ejemplo `https://altum-capital.onrender.com`), esa es tu página en vivo. Las propiedades que agregas desde el admin se siguen perdiendo al recargar hasta que más adelante conectes un backend y base de datos; esta guía es solo para dejar la página publicada en internet.

