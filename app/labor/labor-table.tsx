"use client";

import { deleteLabor } from "@/actions/labor-actions";
import { LaborForm } from "@/app/labor/labor-form";
import { PageHeader } from "@/components/page-header";
import { TableRowActions } from "@/components/table-row-actions";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LaborRecord = {
  id: number;
  role: string;
  baseCost: number;
  baseHours: number;
  extraHourCost: number;
};

type Props = {
  initialData: LaborRecord[];
};

export function LaborTable({ initialData }: Props) {
  const router = useRouter();
  const [laborRecords, setLaborRecords] = useState<LaborRecord[]>(initialData);
  useEffect(() => { setLaborRecords(initialData); }, [initialData]);
  const [selectedLabor, setSelectedLabor] = useState<LaborRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (labor: LaborRecord) => {
    setSelectedLabor(labor);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteLabor(id);
    router.refresh();
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="p-6">
      <PageHeader
        title="Mão de Obra"
        dialogTitle="Nova Mão de Obra"
        dialogContent={(onClose) => (
          <LaborForm onSuccess={() => { onClose(); router.refresh(); }} />
        )}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Função</TableHead>
            <TableHead>Tabela de Custo</TableHead>
            <TableHead className="w-16">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {laborRecords.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground"
              >
                Nenhuma mão de obra cadastrada.
              </TableCell>
            </TableRow>
          ) : (
            laborRecords.map((labor) => (
              <TableRow key={labor.id}>
                <TableCell>{labor.role}</TableCell>
                <TableCell>
                  {formatCurrency(labor.baseCost)} (por {labor.baseHours}h) +{" "}
                  {formatCurrency(labor.extraHourCost)}/h extra
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
          <LaborForm
            record={selectedLabor}
            onSuccess={() => { setIsEditOpen(false); router.refresh(); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
