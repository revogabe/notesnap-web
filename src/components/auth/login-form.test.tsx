import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from './login-form'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

const signInMock = vi.fn()
vi.mock('@/lib/auth-client', () => ({ authClient: { signIn: { email: signInMock, social: vi.fn() } } }))

describe('LoginForm', () => {
  it('valida e faz login com email e senha', async () => {
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })

    signInMock.mockResolvedValueOnce({ data: {}, error: null })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith({ email: 'john@example.com', password: 'password123' })
    })
  })
})
