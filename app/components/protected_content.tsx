'use client'

import { PasswordGate } from './password_gate'

interface ProtectedContentProps {
  streetNumber: string
  propertyAddress: string
  children: React.ReactNode
}

export function ProtectedContent({ streetNumber, propertyAddress, children }: ProtectedContentProps) {
  return (
    <PasswordGate streetNumber={streetNumber} propertyAddress={propertyAddress}>
      {children}
    </PasswordGate>
  )
}
