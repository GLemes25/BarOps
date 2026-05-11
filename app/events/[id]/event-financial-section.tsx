"use client";

import type { ShoppingListItem } from "@/actions/event-actions";
import { updateEventRevenue } from "@/actions/event-actions";
import type {
  EventLaborWithCatalog,
  EventMaterialWithCatalog,
} from "@/actions/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";

type Props = {
  labor: EventLaborWithCatalog[];
  materials: EventMaterialWithCatalog[];
  shoppingList: ShoppingListItem[];
  durationHours: number;
  eventId: number;
  guests: number;
  revenue: number;
};

export function EventFinancialSection({
  labor,
  materials,
  shoppingList,
  durationHours,
  eventId,
  guests,
  revenue: initialRevenue,
}: Props) {
  const [revenue, setRevenue] = useState(initialRevenue);
  const [editing, setEditing] = useState(false);
  const [revenueType, setRevenueType] = useState<"total" | "per_person">("total");
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving] = useState(false);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const laborCost = labor.reduce((acc, item) => {
    const extraHours = Math.max(0, durationHours - item.baseHours);
    return (
      acc + item.quantity * (item.baseCost + extraHours * item.extraHourCost)
    );
  }, 0);

  const materialsCost = materials.reduce(
    (acc, item) => acc + item.quantity * item.defaultCost,
    0,
  );

  const ingredientsCost = shoppingList.reduce(
    (acc, item) => acc + item.estimatedCost,
    0,
  );

  const grandTotal = laborCost + materialsCost + ingredientsCost;
  const costPerPerson = guests > 0 ? grandTotal / guests : 0;
  const profit = revenue - grandTotal;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const revenuePerPerson = guests > 0 ? revenue / guests : 0;

  const handleEditOpen = () => {
    setRevenueType("total");
    setInputValue(String(revenue));
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    const parsed = parseFloat(inputValue.replace(",", "."));
    if (isNaN(parsed) || parsed < 0) return;

    const finalRevenue = revenueType === "per_person" ? parsed * guests : parsed;

    setSaving(true);
    const result = await updateEventRevenue(eventId, finalRevenue);
    setSaving(false);

    if (result.success) {
      setRevenue(finalRevenue);
      setEditing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mão de Obra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{formatCurrency(laborCost)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{formatCurrency(materialsCost)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingredientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {formatCurrency(ingredientsCost)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custo por Pessoa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {formatCurrency(costPerPerson)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor Acertado
              </CardTitle>
              {!editing && (
                <button
                  onClick={handleEditOpen}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <CardDescription>
              {formatCurrency(revenuePerPerson)} / pessoa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setRevenueType("total")}
                    className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                      revenueType === "total"
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Total
                  </button>
                  <button
                    type="button"
                    onClick={() => setRevenueType("per_person")}
                    className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                      revenueType === "per_person"
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Por pessoa
                  </button>
                </div>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="h-8 text-sm"
                  autoFocus
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    className="h-7 px-2 text-xs flex-1"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    {saving ? "..." : "Salvar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xl font-bold">{formatCurrency(revenue)}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lucro Líquido
            </CardTitle>
            <CardDescription>{margin.toFixed(1)}% de margem</CardDescription>
          </CardHeader>
          <CardContent>
            <p
              className={`text-xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(profit)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Categoria</TableHead>
              <TableHead className="text-right whitespace-nowrap">
                Custo Estimado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="whitespace-nowrap">Mão de Obra</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {formatCurrency(laborCost)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="whitespace-nowrap">Materiais</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {formatCurrency(materialsCost)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="whitespace-nowrap">
                Ingredientes (Lista de Compras)
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {formatCurrency(ingredientsCost)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Média por convidado ({guests} convidados)</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {formatCurrency(costPerPerson)}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-semibold whitespace-nowrap">
                Gasto Total Estimado
              </TableCell>
              <TableCell className="text-right font-semibold whitespace-nowrap">
                {formatCurrency(grandTotal)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
