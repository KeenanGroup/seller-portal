'use client'

import { useState, useEffect } from 'react'

interface PasswordGateProps {
  streetNumber: string
  propertyAddress: string
  children: React.ReactNode
}

export function PasswordGate({ streetNumber, propertyAddress, children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const storageKey = `seller_portal_auth_${streetNumber}`

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored === streetNumber) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [storageKey, streetNumber])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === streetNumber) {
      localStorage.setItem(storageKey, streetNumber)
      setIsAuthenticated(true)
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-mulberry">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

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
              <label htmlFor="password" className="block text-sm font-medium text-black/70 mb-2">
                Enter your access code
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mulberry/50 focus:border-mulberry text-center text-2xl tracking-widest"
                placeholder="••••"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-mulberry text-white py-3 px-4 rounded-lg font-medium hover:bg-mulberry-light transition-colors"
            >
              Access Report
            </button>
          </form>

          <p className="text-xs text-black/40 text-center mt-6">
            Your access code was provided by The Keenan Group
          </p>
        </div>

        <div className="text-center mt-6">
          <img
            src="/images/keenan-group-logo.png"
            alt="The Keenan Group"
            className="h-8 mx-auto opacity-60"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>
      </div>
    </div>
  )
}
