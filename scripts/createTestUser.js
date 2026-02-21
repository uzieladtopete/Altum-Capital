import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Leer el archivo .env manualmente
const envFile = readFileSync(join(__dirname, '..', '.env'), 'utf-8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = envVars.VITE_SUPABASE_URL
const supabaseKey = envVars.VITE_SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing VITE_SUPABASE_URL or API key in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestUser() {
  const testEmail = 'admin@altumcapital.com'
  const testPassword = 'admin123'

  console.log('Creating test user...')
  console.log(`Email: ${testEmail}`)
  console.log(`Password: ${testPassword}`)

  try {
    // Obtener o crear usuario en Supabase Auth
    let userId = null
    
    // Primero intentar obtener el usuario existente
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === testEmail)
    
    if (existingUser) {
      console.log('✓ Usuario ya existe en Auth:', existingUser.id)
      userId = existingUser.id
      
      // Actualizar contraseña
      const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
        password: testPassword
      })
      if (updateError) {
        console.error('Error updating password:', updateError)
      } else {
        console.log('✓ Contraseña actualizada')
      }
    } else {
      // Crear nuevo usuario
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true,
      })
      if (authError) {
        console.error('Error creating user:', authError)
        return
      }
      console.log('✓ Usuario creado en Auth:', authData.user?.id)
      userId = authData.user?.id
    }

    // Crear registro en tabla usuarios con role admin
    // Intentar con diferentes nombres de tabla posibles
    if (userId) {
      const tableNames = ['Usuarios', 'usuarios', 'usuarios_admin']
      let success = false
      
      for (const tableName of tableNames) {
        const { error: userError } = await supabase
          .from(tableName)
          .upsert({
            id: userId,
            email: testEmail,
            role: 'admin',
          }, {
            onConflict: 'id'
          })

        if (!userError) {
          console.log(`✓ Registro creado en tabla ${tableName} con role: admin`)
          success = true
          break
        }
      }
      
      if (!success) {
        console.warn('⚠️  No se pudo crear registro en tabla usuarios. Puedes crearlo manualmente en Supabase.')
        console.warn('   Tabla: usuarios (o Usuarios)')
        console.warn('   Campos: id, email, role')
        console.warn(`   Valores: id=${userId}, email=${testEmail}, role=admin`)
      }
    }

    console.log('\n✅ Usuario de prueba creado exitosamente!')
    console.log('\nCredenciales:')
    console.log(`  Email: ${testEmail}`)
    console.log(`  Password: ${testPassword}`)
    console.log('\n⚠️  Recuerda eliminar este usuario después de las pruebas.')
  } catch (error) {
    console.error('Error:', error)
  }
}

createTestUser()
