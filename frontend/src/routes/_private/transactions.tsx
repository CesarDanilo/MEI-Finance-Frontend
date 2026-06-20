import { Header } from '@/components/Header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/transactions')({
  component: TransactionsPage,
})

function TransactionsPage() {
  return (
    <div className="flex flex-col items-center bg-zinc-50 h-screen">
      <Header title="Lançamentos" subtitle="Gerencie seus lançamentos" />
    </div>
  )
}