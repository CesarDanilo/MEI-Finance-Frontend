// src/routes/auth/callback.tsx (file-based) OU dentro do seu router manual
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackPage,
})

function AuthCallbackPage() {
  const navigate = useNavigate()
  const { token } = Route.useSearch() as { token?: string }

  useEffect(() => {
    if (!token) {
      navigate({ to: '/login' })
      return
    }

    localStorage.setItem('accessToken', token)
    navigate({ to: '/dashboard' })
  }, [token, navigate])

  return <p>Autenticando...</p>
}