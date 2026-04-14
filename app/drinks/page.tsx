"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TableRowActions } from "@/components/table-row-actions";
import { DrinkForm } from "@/components/forms/drink-form";
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

type DrinkRecord = {
  id: number;
  name: string;
};

const INITIAL_DRINKS: DrinkRecord[] = [];

export default function DrinksPage() {
  const [drinks, setDrinks] = useState<DrinkRecord[]>(INITIAL_DRINKS);
  const [selectedDrink, setSelectedDrink] = useState<DrinkRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (drink: DrinkRecord) => {
    setSelectedDrink(drink);
    setIsEditOpen(true);
  };

  const handleDelete = (_id: number) => {
    setDrinks((prev) => prev.filter((d) => d.id !== _id));
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Bebidas"
        dialogTitle="Nova Bebida"
        dialogContent={(onClose) => <DrinkForm onSuccess={onClose} />}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="w-16">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drinks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-muted-foreground">
                Nenhuma bebida cadastrada.
              </TableCell>
            </TableRow>
          ) : (
            drinks.map((drink) => (
              <TableRow key={drink.id}>
                <TableCell>{drink.name}</TableCell>
                <TableCell>
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Bebida</DialogTitle>
          </DialogHeader>
          <DrinkForm record={selectedDrink} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
