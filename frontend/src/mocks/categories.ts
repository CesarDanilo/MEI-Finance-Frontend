export interface CategoryOption {
    id: string;
    label: string;
}

export const mockCategories: CategoryOption[] = [
    { id: "vendas", label: "Vendas" },
    { id: "servicos", label: "Serviços" },
    { id: "alimentacao", label: "Alimentação" },
    { id: "transporte", label: "Transporte" },
    { id: "impostos", label: "Impostos" },
    { id: "fornecedores", label: "Fornecedores" },
    { id: "outros", label: "Outros" },
];