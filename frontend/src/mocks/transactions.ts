import type { Transaction } from "@/types/transaction";

export const mockTransactions: Transaction[] = [
    { id: "1", date: "2026-06-19", type: "income", category: "Serviços prestados", description: "Consultoria - Cliente Acme", amount: 2500 },
    { id: "2", date: "2026-06-18", type: "expense", category: "Software", description: "Assinatura ferramenta de design", amount: 89.9 },
    { id: "3", date: "2026-06-16", type: "income", category: "Vendas", description: "Pedido #1042", amount: 780 },
    { id: "4", date: "2026-06-14", type: "expense", category: "Marketing", description: "Anúncios Instagram", amount: 320 },
    { id: "5", date: "2026-06-11", type: "income", category: "Serviços prestados", description: "Manutenção mensal - Cliente Beta", amount: 1200 },
    { id: "6", date: "2026-06-08", type: "expense", category: "Impostos", description: "DAS MEI", amount: 75.6 },
    { id: "7", date: "2026-06-05", type: "income", category: "Vendas", description: "Pedido #1043", amount: 540 },
    { id: "8", date: "2026-06-02", type: "expense", category: "Transporte", description: "Combustível", amount: 220 },
];