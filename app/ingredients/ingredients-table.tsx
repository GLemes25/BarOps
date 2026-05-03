"use client";

import type { IngredientRecord } from "@/actions/ingredient-actions";
import { deleteIngredient } from "@/actions/ingredient-actions";
import { IngredientForm } from "@/app/ingredients/ingredient-form";
import { PageHeader } from "@/components/page-header";
import { TableRowActions } from "@/components/table-row-actions";
import { Badge } from "@/components/ui/badge";
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

type Props = {
  initialData: IngredientRecord[];
};

export function IngredientsTable({ initialData }: Props) {
  const router = useRouter();
  const [ingredients, setIngredients] =
    useState<IngredientRecord[]>(initialData);
  useEffect(() => {
    setIngredients(initialData);
  }, [initialData]);
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
    <div className="p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Ingredientes"
        dialogTitle="Novo Ingrediente"
        dialogContent={(onClose) => (
          <IngredientForm
            availableIngredients={ingredients}
            onSuccess={() => {
              onClose();
              router.refresh();
            }}
          />
        )}
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="whitespace-nowrap">Un. Receita</TableHead>
              <TableHead className="whitespace-nowrap">Un. Compra</TableHead>
              <TableHead className="whitespace-nowrap">Custo de Compra</TableHead>
              <TableHead className="whitespace-nowrap">Fator Rendimento</TableHead>
              <TableHead className="whitespace-nowrap">Custo/Un. Receita</TableHead>
              <TableHead className="w-16 whitespace-nowrap">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  Nenhum ingrediente cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              ingredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {ingredient.name}
                      {ingredient.isSubRecipe && (
                        <Badge variant="secondary">Pre-Batch</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{ingredient.recipeUnit}</TableCell>
                  <TableCell className="whitespace-nowrap">{ingredient.purchaseUnit ?? "—"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {ingredient.purchaseCost !== null
                      ? ingredient.purchaseCost.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {ingredient.yieldQuantity} {ingredient.recipeUnit}
                    {ingredient.purchaseUnit ? `/${ingredient.purchaseUnit}` : ""}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {ingredient.purchaseCost !== null &&
                    ingredient.yieldQuantity > 0
                      ? (
                          ingredient.purchaseCost / ingredient.yieldQuantity
                        ).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 4,
                        }) + `/${ingredient.recipeUnit}`
                      : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
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
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[425px] md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Ingrediente</DialogTitle>
          </DialogHeader>
          <IngredientForm
            record={selectedIngredient}
            availableIngredients={ingredients}
            onSuccess={() => {
              setIsEditOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
