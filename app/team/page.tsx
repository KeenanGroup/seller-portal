'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Portal {
  id: number
  slug: string
  display_name: string
  mls_number: string
  passcode: string
  is_active: boolean
  last_update_date: string | null
  latest_update: string | null
  showing_count: number
}

export default function TeamPortalIndex() {
  const [portals, setPortals] = useState<Portal[]>([])
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === 'keenan2026') {
      localStorage.setItem('team_auth', 'keenan2026')
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect code')
      setCode('')
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem('team_auth')
    if (stored === 'keenan2026') setAuthed(true)
    else setLoading(false)
  }, [])

  useEffect(() => {
    if (!authed) return
    fetch('/api/portals', { headers: { 'x-team-key': 'keenan2026' } })
      .then(r => r.json())
      .then(d => { setPortals(d.portals || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [authed])

  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-mulberry/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-mulberry" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-medium text-mulberry mb-1">Team Dashboard</h1>
              <p className="text-black/50 text-sm">Keenan Group internal portal access</p>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label htmlFor="teamcode" className="block text-sm font-medium text-black/70 mb-2">
                  Enter team access code
                </label>
                <input
                  type="password"
                  id="teamcode"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mulberry/50 focus:border-mulberry text-center text-2xl tracking-widest"
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-600 text-sm text-center">{error}</p>}
              <button type="submit" className="w-full bg-mulberry text-white py-3 rounded-lg font-medium hover:bg-mulberry-light transition-colors">
                Access Dashboard
              </button>
            </form>
            <p className="text-xs text-black/40 text-center mt-6">
              Restricted to Keenan Group team members
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-mulberry">Loading portals...</div>
      </div>
    )
  }

  const formatDate = (d: string | null) => {
    if (!d) return 'No updates yet'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const daysAgo = (d: string | null) => {
    if (!d) return null
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return '1 day ago'
    return diff + ' days ago'
  }

  return (
    <div className="min-h-[80vh]">
      <section className="bg-gradient-to-br from-mulberry via-mulberry to-mulberry-light text-white py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-medium">Seller Portal Dashboard</h1>
              <p className="text-honed-stone mt-1">{portals.length} active listings</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-3 py-1">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-medium text-gold">#1 Team 2024</span>
              </div>
              <button
                onClick={() => { localStorage.removeItem('team_auth'); setAuthed(false) }}
                className="text-sm text-honed-stone/70 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-honed-stone-light">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid gap-3">
            {portals.map(p => (
              <Link
                key={p.id}
                href={"/" + p.slug}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:border-mulberry/20 border border-transparent flex items-center justify-between group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-base font-medium text-black group-hover:text-mulberry transition-colors">
                      {p.display_name}
                    </h2>
                    <span className="text-xs bg-mulberry/10 text-mulberry px-2 py-0.5 rounded-full font-medium">
                      {p.passcode}
                    </span>
                    {p.showing_count > 0 && (
                      <span className="text-xs bg-gold/15 text-gold px-2 py-0.5 rounded-full font-medium">
                        {p.showing_count} showings
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-black/40">
                    <span>MLS# {p.mls_number}</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {daysAgo(p.latest_update) || 'No updates'}
                    </span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-black/20 group-hover:text-mulberry transition-colors flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
