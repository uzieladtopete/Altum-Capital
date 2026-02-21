# Cómo ver los cambios en el navegador

Si no ves los cambios (logo más grande, etc.):

1. **Cierra todas las terminales** donde esté corriendo `npm run dev` (Ctrl+C en cada una).

2. **Abre UNA sola terminal** y ejecuta desde **esta misma carpeta**:
   ```bash
   cd /Users/uzielad/Documents/Altum-Capital
   npm run dev
   ```

3. **Abre el navegador en ventana de incógnito/privada** (Cmd+Shift+N en Chrome, Cmd+Shift+P en Safari) para evitar caché.

4. En la barra de direcciones escribe **solo**:
   ```
   http://localhost:5173
   ```
   (No uses 5174, 5175, etc.)

5. Si aún no se actualiza, en esa pestaña presiona **Cmd+Shift+R** (Mac) o **Ctrl+Shift+R** (Windows) para refresco forzado.

El logo debería verse **bastante más grande** que antes. Si lo ves pequeño, es que el navegador está cargando otra instancia o una versión en caché.
