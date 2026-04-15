"use client";

import type { ShoppingListItem } from "@/actions/event-actions";
import type { EventLaborWithCatalog, EventMaterialWithCatalog } from "@/actions/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  labor: EventLaborWithCatalog[];
  materials: EventMaterialWithCatalog[];
  shoppingList: ShoppingListItem[];
  durationHours: number;
};

export function EventFinancialSection({
  labor,
  materials,
  shoppingList,
  durationHours,
}: Props) {
  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const laborCost = labor.reduce((acc, item) => {
    const extraHours = Math.max(0, durationHours - item.baseHours);
    return acc + item.quantity * (item.baseCost + extraHours * item.extraHourCost);
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

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mão de Obra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(laborCost)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(materialsCost)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingredientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(ingredientsCost)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Custo Estimado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Mão de Obra</TableCell>
            <TableCell className="text-right">
              {formatCurrency(laborCost)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Materiais</TableCell>
            <TableCell className="text-right">
              {formatCurrency(materialsCost)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ingredientes (Lista de Compras)</TableCell>
            <TableCell className="text-right">
              {formatCurrency(ingredientsCost)}
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-semibold">Total Geral</TableCell>
            <TableCell className="text-right font-semibold">
              {formatCurrency(grandTotal)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
