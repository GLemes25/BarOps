"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TableRowActions } from "@/components/table-row-actions";
import { LaborForm } from "@/components/forms/labor-form";
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

type LaborRecord = {
  id: number;
  role: string;
  quantity: number;
  costPerPerson: number;
};

const INITIAL_LABOR: LaborRecord[] = [];

export default function LaborPage() {
  const [laborRecords, setLaborRecords] = useState<LaborRecord[]>(INITIAL_LABOR);
  const [selectedLabor, setSelectedLabor] = useState<LaborRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (labor: LaborRecord) => {
    setSelectedLabor(labor);
    setIsEditOpen(true);
  };

  const handleDelete = (_id: number) => {
    setLaborRecords((prev) => prev.filter((l) => l.id !== _id));
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Mão de Obra"
        dialogTitle="Nova Mão de Obra"
        dialogContent={(onClose) => <LaborForm onSuccess={onClose} />}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Função</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Custo/Pessoa</TableHead>
            <TableHead className="w-16">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {laborRecords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Nenhuma mão de obra cadastrada.
              </TableCell>
            </TableRow>
          ) : (
            laborRecords.map((labor) => (
              <TableRow key={labor.id}>
                <TableCell>{labor.role}</TableCell>
                <TableCell>{labor.quantity}</TableCell>
                <TableCell>
                  {labor.costPerPerson.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>
                  <TableRowActions
                    onEdit={() => handleEdit(labor)}
                    onDelete={() => handleDelete(labor.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Mão de Obra</DialogTitle>
          </DialogHeader>
          <LaborForm record={selectedLabor} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
