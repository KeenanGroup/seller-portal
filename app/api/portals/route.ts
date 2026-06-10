import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

async function payloadFetch(pathname: string) {
  const baseUrl = process.env.PAYLOAD_API_URL || 'https://cms.thekeenangroup.com/api'
  const apiKey = process.env.PAYLOAD_API_KEY
  if (!apiKey) throw new Error('Missing PAYLOAD_API_KEY')

  const res = await fetch(`${baseUrl}${pathname}`, {
    cache: 'no-store',
    headers: { Authorization: `users API-Key ${apiKey}` },
  })

  if (!res.ok) return null
  return res.json()
}

export async function GET(request: NextRequest) {
  const teamKey = request.headers.get('x-team-key')
  if (teamKey !== 'keenan2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await payloadFetch(
    '/seller-portals?where[isActive][equals]=true&sort=displayName&limit=50&depth=0'
  )

  if (!data?.docs) {
    return NextResponse.json({ error: 'Failed to fetch portals' }, { status: 500 })
  }

  const portals = await Promise.all(
    data.docs.map(async (p: any) => {
      let latestUpdate = null
      let showingCount = 0

      const updates = await payloadFetch(
        `/seller-updates?where[portal][equals]=${p.id}&where[isPublished][equals]=true&sort=-weekOf&limit=1&depth=0`
      )

      if (updates?.docs?.[0]) {
        latestUpdate = updates.docs[0].weekOf
        const fullUpdate = await payloadFetch(
          `/seller-updates/${updates.docs[0].id}?depth=0`
        )
        showingCount = fullUpdate?.showings?.length || 0
      }

      return {
        id: p.id,
        slug: p.slug,
        display_name: p.displayName,
        mls_number: p.mlsNumber,
        passcode: p.passcode,
        is_active: p.isActive,
        last_update_date: p.lastUpdateDate,
        latest_update: latestUpdate,
        showing_count: showingCount,
      }
    })
  )

  return NextResponse.json({ portals })
}
