"use client";

import { deleteDrink } from "@/actions/drink-actions";
import { DrinkForm } from "@/app/drinks/drink-form";
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

type DrinkRecord = {
  id: number;
  name: string;
};

type Props = {
  initialData: DrinkRecord[];
};

export function DrinksTable({ initialData }: Props) {
  const router = useRouter();
  const [drinks, setDrinks] = useState<DrinkRecord[]>(initialData);
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
              <TableCell
                colSpan={2}
                className="text-center text-muted-foreground"
              >
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
          <DrinkForm
            record={selectedDrink}
            onSuccess={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
