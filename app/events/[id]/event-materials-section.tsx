"use client";

import { removeEventMaterial } from "@/actions/event-actions";
import type { EventMaterialWithCatalog } from "@/actions/types";
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
import { EventMaterialForm } from "./event-material-form";

type MaterialOption = { id: number; name: string };

type Props = {
  materials: EventMaterialWithCatalog[];
  eventId: number;
  availableMaterials: MaterialOption[];
};

export function EventMaterialsSection({
  materials,
  eventId,
  availableMaterials,
}: Props) {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<EventMaterialWithCatalog | null>(
    null,
  );

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleDelete = async (id: number) => {
    await removeEventMaterial(id, eventId);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Materiais</h2>
        <Button onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Material
        </Button>
      </div>

      {materials.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum material alocado ao evento.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead>Qtd.</TableHead>
              <TableHead>Valor Unitário</TableHead>
              <TableHead>Custo Total</TableHead>
              <TableHead className="w-16">Ações</TableHead>
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
            <DialogTitle>Adicionar Material</DialogTitle>
          </DialogHeader>
          <EventMaterialForm
            eventId={eventId}
            availableMaterials={availableMaterials}
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
            <DialogTitle>Editar Material</DialogTitle>
          </DialogHeader>
          {editRecord && (
            <EventMaterialForm
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
