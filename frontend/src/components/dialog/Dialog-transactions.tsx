import { CalendarIcon, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { mockCategories } from "@/mocks/categories";

export function DialogTransactions() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                    <Plus className="size-4" />
                    Novo Lançamento
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle>Novo Lançamento</DialogTitle>
                    <DialogDescription>
                        Cadastre uma nova movimentação financeira.
                    </DialogDescription>
                </DialogHeader>

                <form className="flex flex-col gap-4">
                    {/* Tipo */}
                    <div className="flex gap-2">
                        <div className="flex flex-col gap-2">
                            <Label>Tipo</Label>
                            <Select defaultValue="INCOME">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INCOME">Receita</SelectItem>
                                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Valor */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="amount">Valor</Label>
                            <Input id="amount" inputMode="decimal" placeholder="0,00" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Categoria</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockCategories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input id="description" placeholder="Ex: Venda de produto" />
                    </div>

                    {/* Data */}
                    <div className="flex flex-col gap-2">
                        <Label>Data do lançamento</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="justify-start text-left font-normal text-muted-foreground"
                                >
                                    <CalendarIcon className="size-4" />
                                    Selecione uma data
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <DialogFooter className="mt-2">
                        <Button type="submit" className="w-full">
                            Salvar Lançamento
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}