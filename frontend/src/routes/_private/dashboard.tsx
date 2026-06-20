import { Header } from '@/components/Header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/dashboard')({
  component: DashbardPage,
})

function DashbardPage() {
  return (
    <div className="flex flex-col items-center bg-zinc-50 h-screen">
      <Header title="Dashboard" subtitle="Visão geral da operação" />
    </div>
  )
}
