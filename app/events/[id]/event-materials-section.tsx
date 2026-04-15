"use client";

import type { EventMaterialWithCatalog } from "@/actions/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  materials: EventMaterialWithCatalog[];
};

export function EventMaterialsSection({ materials }: Props) {
  if (materials.length === 0) {
    return (
      <p className="text-muted-foreground">
        Nenhum material alocado ao evento.
      </p>
    );
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material</TableHead>
          <TableHead>Qtd.</TableHead>
          <TableHead>Valor Unitário</TableHead>
          <TableHead>Custo Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {materials.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{formatCurrency(item.defaultCost)}</TableCell>
            <TableCell>
              {formatCurrency(item.quantity * item.defaultCost)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
