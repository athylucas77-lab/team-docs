import { redirect } from 'next/navigation'
import { createServerSideClient } from '@/lib/supabase-server'

export default async function SharePage({
  params,
}: {
  params: { token: string }
}) {
  const supabase = await createServerSideClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/share/${params.token}`)
  }

  const { data: access } = await supabase
    .from('page_access')
    .select('page, permission')
    .eq('share_token', params.token)
    .single()

  if (!access) {
    redirect('/unauthorized')
  }

  // Grant this user access to the page
  await supabase
    .from('page_access')
    .upsert({
      page: access.page,
      user_id: user.id,
      permission: access.permission,
    }, { onConflict: 'page,user_id' })

  redirect(access.page)
}