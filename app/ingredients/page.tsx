"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TableRowActions } from "@/components/table-row-actions";
import { IngredientForm } from "@/components/forms/ingredient-form";
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

type IngredientRecord = {
  id: number;
  name: string;
  unit: string;
  costPerUnit: number;
};

const INITIAL_INGREDIENTS: IngredientRecord[] = [];

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<IngredientRecord[]>(INITIAL_INGREDIENTS);
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (ingredient: IngredientRecord) => {
    setSelectedIngredient(ingredient);
    setIsEditOpen(true);
  };

  const handleDelete = (_id: number) => {
    setIngredients((prev) => prev.filter((i) => i.id !== _id));
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
              <TableCell colSpan={4} className="text-center text-muted-foreground">
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
                    minimumFractionDigits: 4,
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
          <IngredientForm record={selectedIngredient} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
