'use client'

import { useState, useEffect } from 'react'
import { validatePortalAccess } from './portal_access'

interface PasswordGateProps {
  streetNumber: string
  propertyAddress: string
  storageKey?: string
  portalSlug?: string
  children: React.ReactNode
}

export function PasswordGate({ streetNumber, propertyAddress, storageKey, portalSlug, children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const localKey = `seller_portal_auth_${storageKey || streetNumber}`

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setIsAuthenticated(false)
    const stored = localStorage.getItem(localKey)
    if (portalSlug && stored) {
      validatePortalAccess(portalSlug, stored).then(result => {
        if (!active) return
        setIsAuthenticated(result.ok)
        if (!result.ok) setError(result.error || 'Unable to open this portal.')
        setIsLoading(false)
      })
    } else {
      if (!portalSlug && stored === streetNumber) setIsAuthenticated(true)
      setIsLoading(false)
    }
    return () => { active = false }
  }, [localKey, streetNumber, portalSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const result = portalSlug
      ? await validatePortalAccess(portalSlug, password)
      : { ok: password === streetNumber, error: 'Incorrect password. Please try again.' }
    if (result.ok) {
      localStorage.setItem(localKey, password)
      setIsAuthenticated(true)
    } else {
      setError(result.error || 'Unable to open this portal.')
      setPassword('')
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-mulberry">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) return <>{children}</>

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-mulberry/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-mulberry" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-medium text-mulberry mb-2">Seller Portal Access</h1>
            <p className="text-black/60 text-sm">{propertyAddress}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black/70 mb-2">Enter your access code</label>
              <input type="password" id="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mulberry/50 focus:border-mulberry text-center text-2xl tracking-widest"
                placeholder="----" autoFocus />
            </div>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <button type="submit"
              className="w-full bg-mulberry text-white py-3 px-4 rounded-lg font-medium hover:bg-mulberry-light transition-colors">
              Access Report
            </button>
          </form>
          <p className="text-xs text-black/40 text-center mt-6">Your access code was provided by The Keenan Group</p>
        </div>
      </div>
    </div>
  )
}
