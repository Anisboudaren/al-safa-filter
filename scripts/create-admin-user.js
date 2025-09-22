const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://qbpgclcndalyzflariuv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGdjbGNuZGFseXpmbGFyaXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzE3NDAsImV4cCI6MjA3MDA0Nzc0MH0.eZlhQh-FO4ndlTQu8LZpwyvs6DAr4EAWn71DX9278Mw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    // Create user with email and password
    const { data, error } = await supabase.auth.signUp({
      email: 'anisboud@gmail.com',
      password: 'admin123456'
    })

    if (error) {
      console.error('Error creating user:', error.message)
      return
    }

    if (data.user) {
      console.log('✅ Admin user created successfully!')
      console.log('📧 Email: anisboud@gmail.com')
      console.log('🔑 Password: admin123456')
      console.log('🔗 Login URL: /admin/login')
      console.log('')
      console.log('Note: You may need to confirm the email in Supabase Auth dashboard')
      console.log('or check your email for confirmation link.')
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

createAdminUser()
