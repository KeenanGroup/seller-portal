export async function validatePortalAccess(slug: string, code: string): Promise<{ ok: boolean; error?: string }> {
  if (!code) return { ok: false, error: 'Enter your access code.' }
  try {
    const response = await fetch(`/api/portal/${encodeURIComponent(slug)}`, {
      cache: 'no-store', credentials: 'same-origin', headers: { 'x-portal-passcode': code },
    })
    if (response.status === 401 || response.status === 403) return { ok: false, error: 'Incorrect access code. Please try again.' }
    if (!response.ok) return { ok: false, error: 'Unable to open this portal right now. Please try again.' }
    const data = await response.json()
    return data?.portal?.slug === slug
      ? { ok: true }
      : { ok: false, error: 'Unable to open this portal right now. Please try again.' }
  } catch {
    return { ok: false, error: 'Unable to open this portal right now. Please try again.' }
  }
}
