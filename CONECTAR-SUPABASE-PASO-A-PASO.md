# 🔐 Guía Completa: Conectar Altum Capital con Supabase

Esta guía te llevará paso a paso para conectar tu aplicación con Supabase, incluyendo autenticación, base de datos y almacenamiento de imágenes.

---

## 📝 Nota importante: Cómo crear archivos y carpetas

Antes de empezar, aquí tienes una guía rápida de cómo crear archivos y carpetas en tu proyecto:

### Crear una carpeta nueva:
1. En VS Code/Cursor, haz clic derecho en la carpeta donde quieres crear la nueva carpeta
2. Selecciona **"New Folder"** o **"Nueva carpeta"**
3. Escribe el nombre de la carpeta y presiona Enter

### Crear un archivo nuevo:
1. En VS Code/Cursor, haz clic derecho en la carpeta donde quieres crear el archivo
2. Selecciona **"New File"** o **"Nuevo archivo"**
3. Escribe el nombre del archivo (incluyendo la extensión, ej: `.js`, `.jsx`, `.env`)
4. Presiona Enter
5. Pega el código que se te indique y guarda (Ctrl+S / Cmd+S)

### ¿Dónde está la "raíz del proyecto"?
La raíz es la carpeta principal donde están estos archivos:
- `package.json`
- `vite.config.js`
- `src/` (carpeta)
- `README.md`
- `.gitignore`

Si ves estos archivos en tu explorador, estás en la raíz.

---

## 📋 Tabla de Contenidos

1. [Crear cuenta y proyecto en Supabase](#1-crear-cuenta-y-proyecto-en-supabase)
2. [Configurar la base de datos](#2-configurar-la-base-de-datos)
3. [Configurar autenticación](#3-configurar-autenticación)
4. [Instalar dependencias](#4-instalar-dependencias)
5. [Configurar variables de entorno](#5-configurar-variables-de-entorno)
6. [Crear cliente de Supabase](#6-crear-cliente-de-supabase)
7. [Migrar autenticación a Supabase](#7-migrar-autenticación-a-supabase)
8. [Migrar datos de propiedades](#8-migrar-datos-de-propiedades)
9. [Configurar almacenamiento de imágenes](#9-configurar-almacenamiento-de-imágenes)
10. [Actualizar componentes](#10-actualizar-componentes)
11. [Probar la conexión](#11-probar-la-conexión)

---

## 1. Crear cuenta y proyecto en Supabase

### Paso 1.1: Crear cuenta
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"** o **"Sign Up"**
3. Puedes registrarte con:
   - GitHub (recomendado)
   - Google
   - Email

### Paso 1.2: Crear nuevo proyecto
1. Una vez dentro del dashboard, haz clic en **"New Project"**
2. Completa el formulario:
   - **Name**: `altum-capital` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (¡guárdala bien!)
   - **Region**: Elige la más cercana (ej: `South America (São Paulo)` para México)
   - **Pricing Plan**: Selecciona **Free** (tier gratuito)
3. Haz clic en **"Create new project"**
4. ⏳ Espera 2-3 minutos mientras se crea el proyecto

---

## 2. Configurar la base de datos

### Paso 2.1: Crear tabla de propiedades
1. En el menú lateral, ve a **"Table Editor"**
2. Haz clic en **"New Table"**
3. Configura la tabla:
   - **Name**: `propiedades`
   - **Description**: `Propiedades inmobiliarias`
4. Agrega las siguientes columnas (haz clic en **"Add Column"** para cada una):

| Column Name | Type | Default Value | Nullable | Primary Key |
|------------|------|---------------|----------|-------------|
| `id` | `uuid` | `gen_random_uuid()` | ❌ | ✅ |
| `titulo` | `text` | - | ❌ | ❌ |
| `ciudad` | `text` | - | ❌ | ❌ |
| `zona` | `text` | - | ✅ | ❌ |
| `tipo` | `text` | - | ❌ | ❌ |
| `precio` | `bigint` | - | ❌ | ❌ |
| `m2` | `integer` | - | ❌ | ❌ |
| `lat` | `double precision` | - | ✅ | ❌ |
| `lng` | `double precision` | - | ✅ | ❌ |
| `estado` | `text` | - | ❌ | ❌ |
| `imagen` | `text` | - | ✅ | ❌ |
| `direccion` | `text` | - | ✅ | ❌ |
| `descripcion` | `text` | - | ✅ | ❌ |
| `created_at` | `timestamp` | `now()` | ❌ | ❌ |
| `updated_at` | `timestamp` | `now()` | ❌ | ❌ |

5. Haz clic en **"Save"**

### Paso 2.2: Crear tabla de usuarios (opcional, para roles)
1. Ve a **"Table Editor"** → **"New Table"**
2. **Name**: `usuarios`
3. Agrega columnas:

| Column Name | Type | Default Value | Nullable | Primary Key |
|------------|------|---------------|----------|-------------|
| `id` | `uuid` | - | ❌ | ✅ |
| `email` | `text` | - | ❌ | ❌ |
| `role` | `text` | `'usuario'` | ❌ | ❌ |
| `created_at` | `timestamp` | `now()` | ❌ | ❌ |

4. Haz clic en **"Save"**

### Paso 2.3: Habilitar Row Level Security (RLS)
1. En la tabla `propiedades`, ve a la pestaña **"Policies"**
2. Haz clic en **"New Policy"**
3. Selecciona **"Enable read access for all users"**
4. Crea otra política: **"Enable insert, update, delete for authenticated users only"**
5. Repite para la tabla `usuarios` si la creaste

---

## 3. Configurar autenticación

### Paso 3.1: Configurar proveedores de autenticación
1. En el menú lateral, ve a **"Authentication"** → **"Providers"**
2. Por ahora, deja habilitado solo **"Email"**
3. Opcionalmente puedes habilitar:
   - **Google** (requiere configuración adicional)
   - **GitHub** (requiere configuración adicional)

### Paso 3.2: Configurar URLs de redirección
1. Ve a **"Authentication"** → **"URL Configuration"**
2. Agrega estas URLs en **"Redirect URLs"**:
   ```
   http://localhost:5173
   http://localhost:5173/**
   https://tu-dominio.com
   https://tu-dominio.com/**
   ```
3. Haz clic en **"Save"**

---

## 4. Instalar dependencias

En la terminal, ejecuta:

```bash
npm install @supabase/supabase-js
```

O si usas yarn:

```bash
yarn add @supabase/supabase-js
```

---

## 5. Configurar variables de entorno

### Paso 5.1: Obtener credenciales de Supabase
1. En Supabase, ve a **"Settings"** (⚙️ en el menú lateral izquierdo)
2. Haz clic en **"API Keys"** (en la sección "PROJECT SETTINGS")
3. Si no ves "API Keys", busca **"Data API"** en la sección "CONFIGURATION"
4. Copia estos valores:
   - **Project URL**: Si no la ves directamente, constrúyela así: `https://[tu-project-id].supabase.co`
     - Tu Project ID lo encuentras en **Settings → General** (ejemplo: `akddmtxshutwuzgtiftp`)
     - Entonces la URL sería: `https://akddmtxshutwuzgtiftp.supabase.co`
   - **anon public key**: La clave larga que empieza con `eyJ...` (cópiala con el botón "Copy")

### Paso 5.2: Crear archivo `.env`

**¿Dónde crear el archivo?**
- En la **raíz de tu proyecto** (la misma carpeta donde están `package.json`, `vite.config.js`, `src/`, etc.)
- El archivo debe llamarse exactamente `.env` (con el punto al inicio, sin extensión)

**¿Cómo crearlo?**

**Opción A: Desde VS Code/Cursor (recomendado)**
1. Abre tu proyecto en VS Code/Cursor
2. En el explorador de archivos (lado izquierdo), haz clic derecho en la raíz del proyecto (donde está `package.json`)
3. Selecciona **"New File"** o **"Nuevo archivo"**
4. Escribe exactamente: `.env` (con el punto al inicio)
5. Presiona Enter
6. Pega este contenido en el archivo:

```env
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**Opción B: Desde la Terminal**
1. Abre la terminal en la raíz de tu proyecto
2. Ejecuta: `touch .env` (Mac/Linux) o `type nul > .env` (Windows)
3. Abre el archivo `.env` con tu editor
4. Pega el contenido de arriba

**⚠️ IMPORTANTE**: 
- Reemplaza `tu-proyecto-id` y `tu-anon-key-aqui` con tus valores reales
- **NUNCA** subas el archivo `.env` a GitHub (ya debería estar en `.gitignore`)
- Después de crear el archivo, **reinicia el servidor de desarrollo** (`npm run dev`)

### Paso 5.3: Verificar `.gitignore`
Asegúrate de que `.gitignore` incluya:
```
.env
.env.local
.env.production
```

---

## 6. Crear cliente de Supabase

### Paso 6.1: Crear la carpeta `lib` (si no existe)
1. En VS Code/Cursor, ve a la carpeta `src/`
2. Si no existe una carpeta llamada `lib`, créala:
   - Clic derecho en `src/` → **"New Folder"** → nombre: `lib`

### Paso 6.2: Crear el archivo `supabase.js`
1. Dentro de la carpeta `src/lib/`, haz clic derecho
2. Selecciona **"New File"**
3. Nómbralo: `supabase.js`
4. Pega este código completo:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

5. Guarda el archivo (Ctrl+S / Cmd+S)

---

## 7. Migrar autenticación a Supabase

### Paso 7.1: Actualizar AuthContext

**¿Dónde está el archivo?**
- Ruta: `src/context/AuthContext.jsx`
- Si no lo encuentras, busca en la carpeta `src/context/`

**¿Qué hacer?**
1. Abre el archivo `src/context/AuthContext.jsx` en tu editor
2. **Reemplaza TODO el contenido** del archivo con este código:

```javascript
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('usuario')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sesión al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserRole(session.user.id)
      }
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserRole(session.user.id)
      } else {
        setRole('usuario')
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('role')
        .eq('id', userId)
        .single()

      if (data) {
        setRole(data.role || 'usuario')
      }
    } catch (error) {
      console.error('Error loading user role:', error)
      setRole('usuario')
    }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    
    // Crear registro en tabla usuarios
    if (data.user) {
      await supabase.from('usuarios').insert({
        id: data.user.id,
        email: data.user.email,
        role: 'usuario',
      })
    }
    
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const toggleRole = () => {
    // Solo para desarrollo - eliminar en producción
    setRole((prev) => (prev === 'usuario' ? 'admin' : 'usuario'))
  }

  const value = {
    user,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    toggleRole, // Solo desarrollo
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
```

---

## 8. Migrar datos de propiedades

### Paso 8.1: Crear servicio de propiedades

**¿Dónde crear el archivo?**
- Ruta: `src/services/propiedadesSupabase.js`
- Si la carpeta `services` no existe en `src/`, créala primero:
  1. Clic derecho en `src/` → **"New Folder"** → nombre: `services`

**¿Cómo crearlo?**
1. Dentro de `src/services/`, haz clic derecho
2. Selecciona **"New File"**
3. Nómbralo: `propiedadesSupabase.js`
4. Pega este código completo:

```javascript
import { supabase } from '../lib/supabase'

export async function getPropiedades(filters = {}) {
  let query = supabase.from('propiedades').select('*')

  // Aplicar filtros
  if (filters.ciudad) {
    query = query.eq('ciudad', filters.ciudad)
  }
  if (filters.tipo) {
    query = query.eq('tipo', filters.tipo)
  }
  if (filters.minPrecio) {
    query = query.gte('precio', Number(filters.minPrecio))
  }
  if (filters.maxPrecio) {
    query = query.lte('precio', Number(filters.maxPrecio))
  }
  if (filters.minM2) {
    query = query.gte('m2', Number(filters.minM2))
  }
  if (filters.maxM2) {
    query = query.lte('m2', Number(filters.maxM2))
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching propiedades:', error)
    return []
  }

  return data || []
}

export async function getPropiedadById(id) {
  const { data, error } = await supabase
    .from('propiedades')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching propiedad:', error)
    return null
  }

  return data
}

export async function createPropiedad(propiedad) {
  const { data, error } = await supabase
    .from('propiedades')
    .insert([propiedad])
    .select()
    .single()

  if (error) {
    console.error('Error creating propiedad:', error)
    throw error
  }

  return data
}

export async function updatePropiedad(id, updates) {
  const { data, error } = await supabase
    .from('propiedades')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating propiedad:', error)
    throw error
  }

  return data
}

export async function deletePropiedad(id) {
  const { error } = await supabase
    .from('propiedades')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting propiedad:', error)
    throw error
  }
}
```

### Paso 8.2: Actualizar PropiedadesContext

**¿Dónde está el archivo?**
- Ruta: `src/context/PropiedadesContext.jsx`

**¿Qué hacer?**
1. Abre el archivo `src/context/PropiedadesContext.jsx` en tu editor
2. **Reemplaza TODO el contenido** del archivo con este código:

```javascript
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { propiedades as initialPropiedades } from '../data/propiedades.js'
import {
  getPropiedades,
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
} from '../services/propiedadesSupabase'

const PropiedadesContext = createContext(null)

export function PropiedadesProvider({ children }) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar propiedades al montar
  useEffect(() => {
    loadPropiedades()
  }, [])

  const loadPropiedades = async () => {
    try {
      setLoading(true)
      const data = await getPropiedades()
      setList(data)
    } catch (error) {
      console.error('Error loading propiedades:', error)
      // Fallback a datos locales si falla
      setList([...initialPropiedades])
    } finally {
      setLoading(false)
    }
  }

  const addPropiedad = useCallback(async (prop) => {
    try {
      const newProp = await createPropiedad(prop)
      setList((prev) => [...prev, newProp])
      return newProp
    } catch (error) {
      console.error('Error adding propiedad:', error)
      throw error
    }
  }, [])

  const removePropiedad = useCallback(async (id) => {
    try {
      await deletePropiedad(id)
      setList((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Error removing propiedad:', error)
      throw error
    }
  }, [])

  const updatePropiedad = useCallback(async (id, data) => {
    try {
      const updated = await updatePropiedad(id, data)
      setList((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      )
      return updated
    } catch (error) {
      console.error('Error updating propiedad:', error)
      throw error
    }
  }, [])

  const getFiltered = useCallback(
    async (filters) => {
      try {
        return await getPropiedades(filters)
      } catch (error) {
        console.error('Error filtering propiedades:', error)
        return []
      }
    },
    []
  )

  const value = {
    list,
    loading,
    addPropiedad,
    removePropiedad,
    updatePropiedad,
    getFiltered,
    refresh: loadPropiedades,
  }

  return (
    <PropiedadesContext.Provider value={value}>
      {children}
    </PropiedadesContext.Provider>
  )
}

export function usePropiedades() {
  const ctx = useContext(PropiedadesContext)
  if (!ctx) throw new Error('usePropiedades must be used within PropiedadesProvider')
  return ctx
}

export default PropiedadesContext
```

### Paso 8.3: Importar datos iniciales (opcional)

**¿Dónde crear el archivo?**
- Ruta: `scripts/importData.js`
- Si la carpeta `scripts` no existe en la raíz del proyecto, créala primero:
  1. Clic derecho en la raíz del proyecto (donde está `package.json`)
  2. Selecciona **"New Folder"** → nombre: `scripts`

**¿Cómo crearlo?**
1. Dentro de la carpeta `scripts/`, haz clic derecho
2. Selecciona **"New File"**
3. Nómbralo: `importData.js`
4. Pega este código completo:

```javascript
import { createClient } from '@supabase/supabase-js'
import { propiedades } from '../src/data/propiedades.js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function importData() {
  console.log('Importing propiedades...')
  
  for (const prop of propiedades) {
    const { data, error } = await supabase
      .from('propiedades')
      .insert(prop)
      .select()
    
    if (error) {
      console.error(`Error importing ${prop.titulo}:`, error)
    } else {
      console.log(`✓ Imported ${prop.titulo}`)
    }
  }
  
  console.log('Import complete!')
}

importData()
```

5. Guarda el archivo

**¿Cómo ejecutarlo?**
1. Abre la terminal en la raíz del proyecto
2. Ejecuta: `node scripts/importData.js`
3. Deberías ver mensajes de confirmación por cada propiedad importada

---

## 9. Configurar almacenamiento de imágenes

### Paso 9.1: Crear bucket en Supabase
1. Ve a **"Storage"** en el menú lateral
2. Haz clic en **"New Bucket"**
3. Configura:
   - **Name**: `propiedades-imagenes`
   - **Public bucket**: ✅ (marcado)
   - **File size limit**: `5 MB` (o el que prefieras)
   - **Allowed MIME types**: `image/*`
4. Haz clic en **"Create bucket"**

### Paso 9.2: Configurar políticas del bucket
1. Ve a **"Policies"** del bucket
2. Crea política: **"Allow public read access"**
3. Crea política: **"Allow authenticated users to upload"**

### Paso 9.3: Crear servicio de almacenamiento

**¿Dónde crear el archivo?**
- Ruta: `src/services/storage.js`
- Debe estar en la misma carpeta `src/services/` que creaste antes

**¿Cómo crearlo?**
1. Dentro de `src/services/`, haz clic derecho
2. Selecciona **"New File"**
3. Nómbralo: `storage.js`
4. Pega este código completo:

```javascript
import { supabase } from '../lib/supabase'

const BUCKET_NAME = 'propiedades-imagenes'

export async function uploadImage(file, propiedadId) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${propiedadId}-${Date.now()}.${fileExt}`
  const filePath = `${propiedadId}/${fileName}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading image:', error)
    throw error
  }

  // Obtener URL pública
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return publicUrl
}

export async function deleteImage(filePath) {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath])

  if (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}
```

---

## 10. Actualizar componentes

### Paso 10.1: Actualizar CrearPropiedadPage

**¿Dónde está el archivo?**
- Ruta: `src/pages/admin/CrearPropiedadPage.jsx`

**¿Qué hacer?**
1. Abre el archivo `src/pages/admin/CrearPropiedadPage.jsx` en tu editor
2. Busca la función `handleSubmit` (usa Ctrl+F / Cmd+F para buscarla)
3. **Reemplaza solo la función `handleSubmit`** con este código (mantén el resto del archivo igual):

```javascript
import { uploadImage } from '../../services/storage'

const handleSubmit = async (e) => {
  e.preventDefault()
  
  try {
    let imagenUrl = form.imagen

    // Si hay archivo, subirlo a Supabase
    if (imagenFile) {
      imagenUrl = await uploadImage(imagenFile, 'temp')
    }

    const nuevaPropiedad = {
      titulo: form.titulo,
      ciudad: form.ciudad,
      tipo: form.tipo,
      precio: Number(form.precio),
      m2: Number(form.m2),
      estado: form.estado,
      imagen: imagenUrl,
      direccion: form.direccion || null,
      lat: form.lat || null,
      lng: form.lng || null,
    }

    await addPropiedad(nuevaPropiedad)
    addToast({ type: 'success', message: 'Propiedad creada correctamente' })
    
    // Limpiar formulario
    // ...
  } catch (error) {
    addToast({ type: 'error', message: 'Error al crear la propiedad' })
  }
}
```

---

## 11. Probar la conexión

### Paso 11.1: Verificar variables de entorno
```bash
# En la terminal, ejecuta:
npm run dev
```

Si ves errores sobre variables faltantes, verifica tu archivo `.env`.

### Paso 11.2: Probar autenticación
1. Crea un componente de login temporal o usa Supabase Auth UI
2. Intenta registrarte con un email
3. Verifica que recibas el email de confirmación

### Paso 11.3: Probar CRUD de propiedades
1. Ve al panel admin
2. Intenta crear una propiedad
3. Verifica que aparezca en Supabase → Table Editor
4. Intenta editar y eliminar

### Paso 11.4: Verificar en Supabase Dashboard
1. Ve a **"Table Editor"** → `propiedades`
2. Deberías ver tus propiedades ahí
3. Ve a **"Storage"** → `propiedades-imagenes`
4. Deberías ver las imágenes subidas

---

## 🎉 ¡Listo!

Tu aplicación ahora está conectada con Supabase. Los datos se guardan en la nube y persisten entre sesiones.

---

## 📝 Notas importantes

1. **Seguridad**: Nunca expongas tu `service_role` key en el frontend
2. **RLS**: Asegúrate de tener Row Level Security configurado correctamente
3. **Backups**: Supabase hace backups automáticos en el plan gratuito
4. **Límites**: El plan gratuito tiene límites (500MB de base de datos, 1GB de storage)

---

## 🆘 Troubleshooting

### Error: "Missing Supabase environment variables"
- Verifica que tu archivo `.env` exista y tenga las variables correctas
- Reinicia el servidor de desarrollo después de crear/modificar `.env`

### Error: "Invalid API key"
- Verifica que copiaste la clave correcta (anon key, no service role)
- Asegúrate de que no haya espacios extra

### Las propiedades no se cargan
- Verifica las políticas RLS en Supabase
- Revisa la consola del navegador para errores
- Verifica que la tabla `propiedades` exista y tenga datos

### Las imágenes no se suben
- Verifica que el bucket existe y es público
- Verifica las políticas del bucket
- Revisa el tamaño del archivo (debe ser menor al límite)

---

## 📚 Recursos adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de autenticación](https://supabase.com/docs/guides/auth)
- [Guía de Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**¿Necesitas ayuda?** Revisa los logs en Supabase Dashboard → Logs, o la consola del navegador.
