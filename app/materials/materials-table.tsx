"use client";

import { deleteMaterial } from "@/actions/material-actions";
import { MaterialForm } from "@/app/materials/material-form";
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

type MaterialRecord = {
  id: number;
  name: string;
  quantity: number;
  costPerUnit: number;
};

type Props = {
  initialData: MaterialRecord[];
};

export function MaterialsTable({ initialData }: Props) {
  const router = useRouter();
  const [materials, setMaterials] = useState<MaterialRecord[]>(initialData);
  useEffect(() => { setMaterials(initialData); }, [initialData]);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (material: MaterialRecord) => {
    setSelectedMaterial(material);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteMaterial(id);
    router.refresh();
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Materiais"
        dialogTitle="Novo Material"
        dialogContent={(onClose) => (
          <MaterialForm onSuccess={() => { onClose(); router.refresh(); }} />
        )}
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
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
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
          <MaterialForm
            record={selectedMaterial}
            onSuccess={() => { setIsEditOpen(false); router.refresh(); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
