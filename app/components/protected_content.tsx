'use client'

import { PasswordGate } from './password_gate'

interface ProtectedContentProps {
  streetNumber: string
  propertyAddress: string
  storageKey?: string
  portalSlug?: string
  children: React.ReactNode
}

export function ProtectedContent({ streetNumber, propertyAddress, storageKey, portalSlug, children }: ProtectedContentProps) {
  return (
    <PasswordGate streetNumber={streetNumber} propertyAddress={propertyAddress} storageKey={storageKey} portalSlug={portalSlug}>
      {children}
    </PasswordGate>
  )
}
