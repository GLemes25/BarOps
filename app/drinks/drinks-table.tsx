"use client";

import { deleteDrink } from "@/actions/drink-actions";
import { DrinkForm, type IngredientOption } from "@/app/drinks/drink-form";
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
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, CornerDownRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type DrinkRecord = {
  id: number;
  name: string;
  parentId: number | null;
  variants: { id: number; name: string }[];
  ingredients: {
    id: number;
    name: string;
    quantity: number;
    recipeUnit: string;
  }[];
};

type Props = {
  initialData: DrinkRecord[];
  availableIngredients: IngredientOption[];
};

export function DrinksTable({ initialData, availableIngredients }: Props) {
  const router = useRouter();
  const [drinks, setDrinks] = useState<DrinkRecord[]>(initialData);
  useEffect(() => {
    setDrinks(initialData);
  }, [initialData]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedDrink, setSelectedDrink] = useState<DrinkRecord | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const mainDrinks = drinks
    .filter((d) => d.parentId === null)
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name, "pt-BR")
        : b.name.localeCompare(a.name, "pt-BR"),
    );

  const parentDrinkOptions = drinks
    .filter((d) => d.parentId === null)
    .map((d) => ({ id: d.id, name: d.name }));

  const handleEdit = (drink: DrinkRecord) => {
    setSelectedDrink(drink);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await deleteDrink(id);
    if (!result.success) {
      toast.error(result.error ?? "Erro ao excluir bebida");
      return;
    }
    toast.success("Bebida excluída");
    router.refresh();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Bebidas"
        dialogTitle="Nova Bebida"
        dialogContent={(onClose) => (
          <DrinkForm
            onSuccess={() => {
              onClose();
              router.refresh();
            }}
            availableIngredients={availableIngredients}
            availableParentDrinks={parentDrinkOptions}
          />
        )}
      />

      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60%] sm:w-[40%]">
              <div
                className="flex items-center gap-2 cursor-pointer select-none hover:text-foreground transition-colors"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                Nome
                {sortOrder === "asc" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="hidden sm:table-cell sm:w-[40%]">Receita</TableHead>
            <TableHead className="w-12.5 md:w-17.5 text-right">Ações</TableHead>
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
            mainDrinks.map((drink) => (
              <React.Fragment key={drink.id}>
                <TableRow>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="truncate block">{drink.name}</span>
                      {drink.variants.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="w-fit text-xs cursor-pointer hover:bg-secondary/80 transition-colors select-none"
                          onClick={() => toggleRow(drink.id)}
                        >
                          {expandedRows.has(drink.id) ? (
                            <ChevronDown className="mr-1 h-3 w-3" />
                          ) : (
                            <ChevronRight className="mr-1 h-3 w-3" />
                          )}
                          {drink.variants.length} variaç
                          {drink.variants.length !== 1 ? "ões" : "ão"}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell truncate text-sm">
                    {drink.ingredients.length === 0
                      ? "—"
                      : drink.ingredients
                          .map(
                            (ing) =>
                              `${ing.name} (${ing.quantity}${ing.recipeUnit})`,
                          )
                          .join(", ")}
                  </TableCell>
                  <TableCell className="w-12.5 md:w-17.5 text-right">
                    <TableRowActions
                      onEdit={() => handleEdit(drink)}
                      onDelete={() => handleDelete(drink.id)}
                    />
                  </TableCell>
                </TableRow>

                {expandedRows.has(drink.id) &&
                  drinks
                    .filter((d) => d.parentId === drink.id)
                    .sort((a, b) =>
                      sortOrder === "asc"
                        ? a.name.localeCompare(b.name, "pt-BR")
                        : b.name.localeCompare(a.name, "pt-BR"),
                    )
                    .map((child) => (
                      <TableRow
                        key={child.id}
                        className="bg-muted/30 hover:bg-muted/30"
                      >
                        <TableCell className="pl-8 sm:pl-12">
                          <div className="flex items-center gap-2 min-w-0">
                            <CornerDownRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate">{child.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell truncate text-sm">
                          {child.ingredients.length === 0
                            ? "—"
                            : child.ingredients
                                .map(
                                  (ing) =>
                                    `${ing.name} (${ing.quantity}${ing.recipeUnit})`,
                                )
                                .join(", ")}
                        </TableCell>
                        <TableCell className="w-12.5 md:w-17.5 text-right">
                          <TableRowActions
                            onEdit={() => handleEdit(child)}
                            onDelete={() => handleDelete(child.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-106.25 md:max-w-2xl">
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
            availableParentDrinks={parentDrinkOptions}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
