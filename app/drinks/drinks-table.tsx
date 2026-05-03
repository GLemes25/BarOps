"use client";

import { deleteDrink } from "@/actions/drink-actions";
import { DrinkForm, type IngredientOption } from "@/app/drinks/drink-form";
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

type DrinkRecord = {
  id: number;
  name: string;
  ingredients: { id: number; name: string; quantity: number; recipeUnit: string }[];
};

type Props = {
  initialData: DrinkRecord[];
  availableIngredients: IngredientOption[];
};

export function DrinksTable({ initialData, availableIngredients }: Props) {
  const router = useRouter();
  const [drinks, setDrinks] = useState<DrinkRecord[]>(initialData);
  useEffect(() => { setDrinks(initialData); }, [initialData]);
  const [selectedDrink, setSelectedDrink] = useState<DrinkRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (drink: DrinkRecord) => {
    setSelectedDrink(drink);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteDrink(id);
    router.refresh();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Bebidas"
        dialogTitle="Nova Bebida"
        dialogContent={(onClose) => (
          <DrinkForm
            onSuccess={() => { onClose(); router.refresh(); }}
            availableIngredients={availableIngredients}
          />
        )}
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Nome</TableHead>
              <TableHead>Receita</TableHead>
              <TableHead className="w-16 whitespace-nowrap">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drinks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  Nenhuma bebida cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              drinks.map((drink) => (
                <TableRow key={drink.id}>
                  <TableCell className="whitespace-nowrap">{drink.name}</TableCell>
                  <TableCell>
                    {drink.ingredients.length === 0
                      ? "—"
                      : drink.ingredients
                          .map((ing) => `${ing.name} (${ing.quantity}${ing.recipeUnit})`)
                          .join(", ")}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <TableRowActions
                      onEdit={() => handleEdit(drink)}
                      onDelete={() => handleDelete(drink.id)}
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
            <DialogTitle>Editar Bebida</DialogTitle>
          </DialogHeader>
          <DrinkForm
            record={selectedDrink}
            onSuccess={() => {
              setIsEditOpen(false);
              router.refresh();
            }}
            availableIngredients={availableIngredients}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
