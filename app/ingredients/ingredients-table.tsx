"use client";

import { deleteIngredient } from "@/actions/ingredient-actions";
import { IngredientForm } from "@/app/ingredients/ingredient-form";
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
import { useState } from "react";

type IngredientRecord = {
  id: number;
  name: string;
  unit: string;
  costPerUnit: number;
};

type Props = {
  initialData: IngredientRecord[];
};

export function IngredientsTable({ initialData }: Props) {
  const router = useRouter();
  const [ingredients, setIngredients] =
    useState<IngredientRecord[]>(initialData);
  const [selectedIngredient, setSelectedIngredient] =
    useState<IngredientRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (ingredient: IngredientRecord) => {
    setSelectedIngredient(ingredient);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteIngredient(id);
    router.refresh();
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Ingredientes"
        dialogTitle="Novo Ingrediente"
        dialogContent={(onClose) => <IngredientForm onSuccess={onClose} />}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Custo/Unidade</TableHead>
            <TableHead className="w-16">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                Nenhum ingrediente cadastrado.
              </TableCell>
            </TableRow>
          ) : (
            ingredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.unit}</TableCell>
                <TableCell>
                  {ingredient.costPerUnit.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  <TableRowActions
                    onEdit={() => handleEdit(ingredient)}
                    onDelete={() => handleDelete(ingredient.id)}
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
            <DialogTitle>Editar Ingrediente</DialogTitle>
          </DialogHeader>
          <IngredientForm
            record={selectedIngredient}
            onSuccess={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
