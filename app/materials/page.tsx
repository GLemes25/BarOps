"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TableRowActions } from "@/components/table-row-actions";
import { MaterialForm } from "@/components/forms/material-form";
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

type MaterialRecord = {
  id: number;
  name: string;
  quantity: number;
  costPerUnit: number;
};

const INITIAL_MATERIALS: MaterialRecord[] = [];

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<MaterialRecord[]>(INITIAL_MATERIALS);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (material: MaterialRecord) => {
    setSelectedMaterial(material);
    setIsEditOpen(true);
  };

  const handleDelete = (_id: number) => {
    setMaterials((prev) => prev.filter((m) => m.id !== _id));
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Materiais"
        dialogTitle="Novo Material"
        dialogContent={(onClose) => <MaterialForm onSuccess={onClose} />}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Custo/Unidade</TableHead>
            <TableHead className="w-16">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Nenhum material cadastrado.
              </TableCell>
            </TableRow>
          ) : (
            materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.name}</TableCell>
                <TableCell>{material.quantity}</TableCell>
                <TableCell>
                  {material.costPerUnit.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>
                  <TableRowActions
                    onEdit={() => handleEdit(material)}
                    onDelete={() => handleDelete(material.id)}
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
            <DialogTitle>Editar Material</DialogTitle>
          </DialogHeader>
          <MaterialForm record={selectedMaterial} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
