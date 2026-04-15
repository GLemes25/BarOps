"use client";

import { removeEventLabor } from "@/actions/event-actions";
import type { EventLaborWithCatalog } from "@/actions/types";
import { TableRowActions } from "@/components/table-row-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EventLaborForm } from "./event-labor-form";

type LaborOption = { id: number; role: string };

type Props = {
  labor: EventLaborWithCatalog[];
  durationHours: number;
  eventId: number;
  availableLabor: LaborOption[];
};

export function EventLaborSection({
  labor,
  durationHours,
  eventId,
  availableLabor,
}: Props) {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<EventLaborWithCatalog | null>(null);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const calcLaborCost = (item: EventLaborWithCatalog) => {
    const extraHours = Math.max(0, durationHours - item.baseHours);
    return item.quantity * (item.baseCost + extraHours * item.extraHourCost);
  };

  const handleDelete = async (id: number) => {
    await removeEventLabor(id, eventId);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Equipe</h2>
        <Button onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Mão de Obra
        </Button>
      </div>

      {labor.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma equipe alocada ao evento.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Função</TableHead>
              <TableHead>Qtd.</TableHead>
              <TableHead>Tabela de Custo</TableHead>
              <TableHead>Custo Total</TableHead>
              <TableHead className="w-16">Ações</TableHead>
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
                <TableCell>
                  <TableRowActions
                    onEdit={() => setEditRecord(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Mão de Obra</DialogTitle>
          </DialogHeader>
          <EventLaborForm
            eventId={eventId}
            availableLabor={availableLabor}
            onSuccess={() => {
              setIsAddOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editRecord}
        onOpenChange={(open) => !open && setEditRecord(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Mão de Obra</DialogTitle>
          </DialogHeader>
          {editRecord && (
            <EventLaborForm
              eventId={eventId}
              record={{ id: editRecord.id, quantity: editRecord.quantity }}
              onSuccess={() => {
                setEditRecord(null);
                router.refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
