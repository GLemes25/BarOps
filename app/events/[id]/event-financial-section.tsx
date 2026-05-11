"use client";

import type { ShoppingListItem } from "@/actions/event-actions";
import type {
  EventLaborWithCatalog,
  EventMaterialWithCatalog,
} from "@/actions/types";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

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
  revenue,
}: Props) {
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
            <p className="text-2xl font-bold">
              {formatCurrency(materialsCost)}
            </p>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custo por Pessoa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(costPerPerson)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total (Cobrado)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(revenue)}</p>
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
            <p className={`text-2xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
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
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="whitespace-nowrap">
                    Ingredientes (Lista de Compras)
                  </span>
                  <Link
                    href={`/events/${eventId}/shopping-list`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ver Lista de Compras
                  </Link>
                </div>
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
