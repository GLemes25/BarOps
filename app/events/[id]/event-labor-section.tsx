"use client";

import type { EventLaborWithCatalog } from "@/actions/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  labor: EventLaborWithCatalog[];
  durationHours: number;
};

export function EventLaborSection({ labor, durationHours }: Props) {
  if (labor.length === 0) {
    return (
      <p className="text-muted-foreground">Nenhuma equipe alocada ao evento.</p>
    );
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const calcLaborCost = (item: EventLaborWithCatalog) => {
    const extraHours = Math.max(0, durationHours - item.baseHours);
    return item.quantity * (item.baseCost + extraHours * item.extraHourCost);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Função</TableHead>
          <TableHead>Qtd.</TableHead>
          <TableHead>Tabela de Custo</TableHead>
          <TableHead>Custo Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {labor.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.role}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatCurrency(item.baseCost)} (por {item.baseHours}h) +{" "}
              {formatCurrency(item.extraHourCost)}/h extra
            </TableCell>
            <TableCell>{formatCurrency(calcLaborCost(item))}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
