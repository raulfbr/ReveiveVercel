import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const email = process.env.DEMO_AUTH_EMAIL || process.env.NEXT_PUBLIC_DEMO_AUTH_EMAIL || 'demo@revivevoluntariado.org'
const password = process.env.DEMO_AUTH_PASSWORD || process.env.NEXT_PUBLIC_DEMO_AUTH_PASSWORD || 'ReviveDemo2026!'
const fullName = process.env.DEMO_AUTH_FULL_NAME || 'Conta Demo Revive'
const role = process.env.DEMO_AUTH_ROLE || 'admin'

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Faltam variaveis: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.')
  console.error('Use somente em ambiente de teste. Nunca exponha SUPABASE_SERVICE_ROLE_KEY no navegador.')
  process.exit(1)
}

if (!['admin', 'viewer'].includes(role)) {
  console.error('DEMO_AUTH_ROLE precisa ser admin ou viewer.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function findUserByEmail(targetEmail) {
  let page = 1
  const perPage = 1000

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })

    if (error) {
      throw error
    }

    const users = data?.users ?? []
    const foundUser = users.find((user) => user.email?.toLowerCase() === targetEmail.toLowerCase())

    if (foundUser) {
      return foundUser
    }

    if (users.length < perPage) {
      return null
    }

    page += 1
  }

  return null
}

async function upsertDemoUser() {
  const existingUser = await findUserByEmail(email)
  let authUser = existingUser

  if (!authUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        demo: true,
      },
    })

    if (error) {
      throw error
    }

    authUser = data.user
  } else {
    const { data, error } = await supabase.auth.admin.updateUserById(authUser.id, {
      password,
      user_metadata: {
        full_name: fullName,
        demo: true,
      },
    })

    if (error) {
      throw error
    }

    authUser = data.user
  }

  if (!authUser?.id) {
    throw new Error('Nao foi possivel criar ou localizar o usuario demo no Supabase Auth.')
  }

  const { error: appUserError } = await supabase.from('app_users').upsert(
    {
      auth_user_id: authUser.id,
      email: email.toLowerCase(),
      full_name: fullName,
      role,
      active: true,
    },
    {
      onConflict: 'email',
    },
  )

  if (appUserError) {
    throw appUserError
  }

  console.log('Conta demo pronta para teste.')
  console.log(`Email: ${email}`)
  console.log(`Senha: ${password}`)
  console.log(`Papel: ${role}`)
}

upsertDemoUser().catch((error) => {
  console.error('Falha ao preparar conta demo.')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
