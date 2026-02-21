# Conectar tu dominio (DNS) con Render

Guía para apuntar tu dominio (ej. `altum-capital.com.mx`) a un servicio desplegado en [Render](https://render.com).

---

## ¿Los DNS son "dos números"?

**No.** Para conectar tu dominio con Render **no** hace falta cambiar los "números" del dominio (esos serían los *nameservers*, que en GoDaddy suelen verse como `ns01.domaincontrol.com`, etc.). Esos se quedan como están.

Lo que sí hay que hacer es **añadir dos registros DNS** con la información que te da Render:

1. **Para `www`** (por ejemplo `www.altum-capital.com.mx`): un registro donde el **nombre** es `www` y el **valor** es la dirección de Render (ej. `altum-capital.onrender.com`).
2. **Para el dominio sin www** (por ejemplo `altum-capital.com.mx`): un registro donde el **nombre** es `@` y el **valor** puede ser la misma dirección de Render o, en GoDaddy, la IP que indica Render: **`216.24.57.1`**.

Es decir: no son dos números mágicos; son **nombre + valor** que Render te muestra en pantalla. Esa información se configura en **quien administre tus DNS**: si los nameservers son de HostGator, se hace en HostGator; si son de GoDaddy, en GoDaddy.

---

## 0. Variables de entorno (evitar página en blanco)

Si tu sitio en Render se ve **en blanco**, suele ser porque faltan las variables de Supabase. Vite las inyecta en el build, así que deben estar definidas **antes** de que Render ejecute `npm run build`.

1. En el **Dashboard** de Render, entra a tu **Static Site** (o Web Service).
2. Ve a **Environment** (Environment Variables).
3. Añade:
   - **Key:** `VITE_SUPABASE_URL` → **Value:** la URL de tu proyecto (ej. `https://xxxx.supabase.co`).
   - **Key:** `VITE_SUPABASE_ANON_KEY` → **Value:** la clave anónima (anon/public) de Supabase (Settings → API en el proyecto Supabase).
4. Guarda y haz un **nuevo deploy** (Manual Deploy o push al repo) para que el build use estas variables.

Sin ellas, la app puede cargar pero auth y datos de Supabase no funcionarán; con los últimos cambios la página ya no debería quedar en blanco aunque falten, pero conviene configurarlas.

---

## 1. Tener el servicio en Render

- Crea una cuenta en [render.com](https://render.com) si no tienes.
- Despliega tu proyecto (Web Service o Static Site).
- Anota la URL que te da Render, por ejemplo: **`tu-app.onrender.com`**.

---

## 2. Añadir el dominio en Render

1. En el **Dashboard** de Render, entra a tu servicio (Web Service o Static Site).
2. Ve a **Settings** → **Custom Domains**.
3. Pulsa **Add Custom Domain**.
4. Escribe tu dominio:
   - Dominio raíz: `tudominio.com`
   - Subdominio: `www.tudominio.com`
5. Render te indicará qué registros DNS debes crear (y te dará un valor tipo `srv-xxx.onrender.com` si aplica). Sigue esas instrucciones y complementa con esta guía.

---

## 3. Configurar DNS en tu proveedor de dominio

Entra al panel de tu proveedor (donde compraste el dominio: Namecheap, GoDaddy, Google Domains, Cloudflare, etc.) y edita los registros DNS.

### Reglas generales

| Qué quieres | Tipo de registro | Nombre / Host | Valor / Apunta a |
|------------|------------------|----------------|------------------|
| **Dominio raíz** (`tudominio.com`) | **A** | `@` (o vacío) | `216.24.57.1` |
| **www** (`www.tudominio.com`) | **CNAME** | `www` | `tu-app.onrender.com` |

- **Importante:** Si tienes registros **AAAA** (IPv6) para ese dominio o para `www`, **elimínalos**. Render usa solo IPv4 y pueden dar problemas.

### Si tu proveedor permite ANAME o ALIAS (dominio raíz)

Algunos proveedores (DNSimple, DNS Made Easy, Name.com, NS1, etc.) permiten **ANAME** o **ALIAS** en el dominio raíz. En ese caso:

- Tipo: **ANAME** o **ALIAS**
- Nombre: `@` (o raíz)
- Valor: **`tu-app.onrender.com`**

Así el raíz apunta directo a tu servicio en Render.

---

## 4. Ejemplos por proveedor

### Namecheap

1. Dominio → **Manage** → **Advanced DNS**.
2. **Dominio raíz** (`tudominio.com`):
   - Tipo: **A Record**
   - Host: `@`
   - Value: `216.24.57.1`
   - TTL: Automatic (o 300).
3. **www**:
   - Tipo: **CNAME Record**
   - Host: `www`
   - Value: `tu-app.onrender.com`
   - TTL: Automatic.
4. Borra cualquier **AAAA** que apunte a `@` o `www` si existe.

### GoDaddy (paso a paso para altum-capital.com.mx)

Render te pide **dos registros**. En GoDaddy no usas "dos números" (nameservers); usas la **misma información que muestra Render**: hostname + valor. Así se hace:

1. Entra a [GoDaddy](https://www.godaddy.com) e inicia sesión.
2. Ve a **Mis Productos** → busca **altum-capital.com.mx** → **Administrar** (o **Administrar DNS**).
3. En la sección **Registros DNS** (o **DNS** / **Zona DNS**), vas a **agregar** o **editar** registros. Necesitas **dos**:

   **Registro 1 – Para `www.altum-capital.com.mx` (lo que Render llama "www subdomain"):**
   - Tipo: **CNAME**
   - Nombre / Host: **`www`** (solo eso; a veces el panel agrega solo `.com.mx`, está bien).
   - Valor / Apunta a / Destino: **`altum-capital.onrender.com`** (cópialo tal cual de Render).
   - TTL: por defecto (ej. 1 hora).
   - Guardar.

   **Registro 2 – Para `altum-capital.com.mx` (dominio raíz, lo que Render llama "root domain"):**  
   En GoDaddy el raíz no suele aceptar CNAME, por eso Render dice que uses **A** si tu proveedor lo pide:
   - Tipo: **A**
   - Nombre / Host: **`@`** (o el que use GoDaddy para "raíz", a veces vacío o el propio dominio).
   - Valor / Apunta a / Dirección IP: **`216.24.57.1`** (el número que Render te da para registros A).
   - TTL: por defecto.
   - Guardar.

4. Si ves registros **AAAA** (IPv6) para `@` o `www` de este dominio, **elimínalos** (Render usa solo IPv4).

**Resumen para tu papá:** No son "dos números" genéricos. Son **dos registros**: uno para `www` (con el texto `altum-capital.onrender.com`) y otro para el dominio principal (con la IP `216.24.57.1`). Esa es la información que Render muestra y con eso basta en GoDaddy.

### Cloudflare

1. En **DNS** del sitio:
2. **CNAME** para el raíz: nombre `@`, objetivo `tu-app.onrender.com` (Cloudflare permite CNAME en raíz).
3. **CNAME** para `www`: nombre `www`, objetivo `tu-app.onrender.com`.
4. Proxy: pon **DNS only** (nube gris) al menos hasta que Render verifique.
5. **SSL/TLS** → Overview: modo **Full** (no “Flexible”).
6. Sin **AAAA** apuntando a Render.

### Google Domains / Cloud Identity

1. **DNS** → Registros personalizados.
2. **A**: nombre `@`, IPv4 `216.24.57.1`.
3. **CNAME**: nombre `www`, nombre de host de destino `tu-app.onrender.com`.
4. Quita **AAAA** si existen para ese dominio.

---

## 5. Esperar propagación y verificar

- Los cambios DNS pueden tardar **unos minutos hasta 48 horas** (suele ser 5–30 minutos).
- Para comprobar:
  - **Raíz:** `dig tudominio.com` o [dnschecker.org](https://dnschecker.org) (debe apuntar a `216.24.57.1` o al CNAME que uses).
  - **www:** `dig www.tudominio.com` (debe mostrar el CNAME a `tu-app.onrender.com`).
- En Render: **Settings** → **Custom Domains**. Ahí verás el estado de verificación y del certificado SSL (Render suele gestionar HTTPS automáticamente).

---

## 6. Resumen rápido (GoDaddy + altum-capital.com.mx)

1. En Render ya tienes el dominio añadido y te pide los dos registros.
2. En GoDaddy → **Mis Productos** → **altum-capital.com.mx** → **Administrar DNS**.
3. Añade:
   - **CNAME**: nombre `www`, valor **`altum-capital.onrender.com`**.
   - **A**: nombre `@`, valor **`216.24.57.1`**.
4. Elimina registros **AAAA** si aparecen.
5. Espera unos minutos (hasta 24 h) y en Render → **Custom Domains** revisa que el dominio aparezca verificado.
