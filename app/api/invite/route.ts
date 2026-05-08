import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createServerSideClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const { email, page, permission } = await request.json()

    // Verify the requester is an admin
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role client to invite user
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Invite the user — sends email automatically
    const { data: inviteData, error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
      data: { invited_by: user.email },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    })

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 400 })
    }

    // Grant page access and create profile
    if (inviteData.user && page) {
      await adminSupabase
        .from('page_access')
        .upsert({
          page,
          user_id: inviteData.user.id,
          permission,
        }, { onConflict: 'page,user_id' })

      await adminSupabase
        .from('profiles')
        .upsert({
          id: inviteData.user.id,
          email,
          role: 'user',
        }, { onConflict: 'id' })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}