import { vi, describe, it, expect, beforeEach } from 'vitest'
import * as authClientModule from '@src/lib/auth-client'
import { getAuthUser } from '@src/services/auth.service'

describe('getAuthUser', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns session when available', () => {
    const mockSession = { session: { user: { id: 'u1' } } }
    vi.spyOn(authClientModule, 'authClient', 'get').mockReturnValue({
      useSession: () => ({ data: mockSession }),
    } as any)

    const result = getAuthUser()
    expect(result).toEqual({ ...mockSession.session })
  })

  it('returns undefined when no session data', () => {
    vi.spyOn(authClientModule, 'authClient', 'get').mockReturnValue({
      useSession: () => ({ data: null }),
    } as any)

    const result = getAuthUser()
    expect(result).toBeUndefined()
  })
})
