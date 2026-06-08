"use client";

import type { ShoppingListItem } from "@/actions/event-actions";
import type { EventWithRelations } from "@/actions/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Minus, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { PrintButton } from "./print-button";

dayjs.locale("pt-br");

type LocalShoppingItem = ShoppingListItem & {
  id: string;
  originalName: string;
  originalQty: number;
  isDeleted: boolean;
  isNew: boolean;
  unitPrice: number;
  customCost: number;
};

type Props = {
  event: EventWithRelations;
  shoppingList: ShoppingListItem[];
};

export function ShoppingListSection({ event, shoppingList }: Props) {
  const [items, setItems] = useState<LocalShoppingItem[]>(() =>
    shoppingList.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
      originalName: item.ingredientName,
      originalQty: item.quantityToBuy,
      isDeleted: false,
      isNew: false,
      unitPrice:
        item.quantityToBuy > 0 ? item.estimatedCost / item.quantityToBuy : 0,
      customCost: item.estimatedCost,
    })),
  );

  const totalCost = items
    .filter((item) => !item.isDeleted)
    .reduce((sum, item) => sum + item.customCost, 0);

  function updateItem(id: string, updates: Partial<LocalShoppingItem>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }

  function resetItem(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ingredientName: item.originalName,
              quantityToBuy: item.originalQty,
              customCost: item.originalQty * item.unitPrice,
              isDeleted: false,
            }
          : item,
      ),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ingredientName: "",
        originalName: "",
        totalNeeded: 0,
        recipeUnit: "",
        quantityToBuy: 1,
        originalQty: 1,
        purchaseUnit: "",
        estimatedCost: 0,
        isDeleted: false,
        isNew: true,
        unitPrice: 0,
        customCost: 0,
      },
    ]);
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-end print:hidden">
        <PrintButton />
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Lista de Compras</h1>
        <p className="text-muted-foreground text-sm">
          {event.name} · {dayjs(event.date).format("D [de] MMMM [de] YYYY")}
          {event.time && ` · às ${event.time.replace(":", "h")}`} ·{" "}
          {event.guests} convidado{event.guests !== 1 ? "s" : ""}
        </p>
      </div>

      <Separator />

      {items.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum ingrediente encontrado para este evento.
        </p>
      ) : (
        <ul className="flex flex-col">
          {items.map((item) => {
            const baselineCost = item.quantityToBuy * item.unitPrice;

            const isModified =
              item.quantityToBuy !== item.originalQty ||
              item.ingredientName !== item.originalName ||
              item.isDeleted ||
              item.customCost !== baselineCost;

            const nameColor = item.isDeleted
              ? "line-through opacity-50 text-muted-foreground"
              : item.isNew
                ? "text-emerald-600 dark:text-emerald-400"
                : item.ingredientName !== item.originalName
                  ? "text-amber-600 dark:text-amber-400"
                  : "";

            const qtyColor = item.isDeleted
              ? "opacity-50 text-muted-foreground"
              : item.isNew
                ? "text-emerald-600 dark:text-emerald-400"
                : item.quantityToBuy < item.originalQty
                  ? "text-emerald-600 dark:text-emerald-400"
                  : item.quantityToBuy > item.originalQty
                    ? "text-destructive"
                    : "";

            return (
              <li
                key={item.id}
                className={cn(
                  "flex items-center gap-2 py-2 border-b last:border-0",
                  item.isDeleted && "print:hidden",
                )}
              >
                <div className="flex-1 min-w-0">
                  <Input
                    value={item.ingredientName}
                    onChange={(e) =>
                      updateItem(item.id, { ingredientName: e.target.value })
                    }
                    disabled={item.isDeleted}
                    className={cn(
                      "border-transparent bg-transparent hover:border-input focus-visible:ring-1 font-medium h-8 px-2 print:hidden",
                      nameColor,
                    )}
                  />
                  <span
                    className={cn(
                      "hidden print:inline print:text-black font-medium",
                    )}
                  >
                    {item.ingredientName}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 print:hidden"
                    disabled={item.isDeleted}
                    onClick={() => {
                      const newQty = Math.max(0, item.quantityToBuy - 1);
                      updateItem(item.id, {
                        quantityToBuy: newQty,
                        customCost: newQty * item.unitPrice,
                      });
                    }}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantityToBuy}
                    onChange={(e) => {
                      const newQty = Number(e.target.value);
                      updateItem(item.id, {
                        quantityToBuy: newQty,
                        customCost: newQty * item.unitPrice,
                      });
                    }}
                    disabled={item.isDeleted}
                    className={cn(
                      "w-16 text-center border-none bg-transparent h-8 px-1 print:hidden",
                      qtyColor,
                    )}
                  />
                  <span className="hidden print:inline print:text-black text-sm">
                    {item.quantityToBuy}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 print:hidden"
                    disabled={item.isDeleted}
                    onClick={() => {
                      const newQty = item.quantityToBuy + 1;
                      updateItem(item.id, {
                        quantityToBuy: newQty,
                        customCost: newQty * item.unitPrice,
                      });
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <span className="text-sm text-muted-foreground shrink-0 print:text-black">
                  {item.purchaseUnit}
                </span>

                <div className="flex items-center shrink-0 print:hidden">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.customCost}
                    onChange={(e) =>
                      updateItem(item.id, {
                        customCost: Number(e.target.value),
                      })
                    }
                    disabled={item.isDeleted}
                    className={cn(
                      "w-20 text-right border-transparent bg-transparent hover:border-input focus-visible:ring-1 h-8 px-1 font-semibold text-sm",
                      item.isDeleted
                        ? "opacity-50 text-muted-foreground"
                        : item.isNew
                          ? ""
                          : item.customCost > baselineCost
                            ? "text-destructive"
                            : item.customCost < baselineCost
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "",
                    )}
                  />
                </div>
                <span className="hidden print:inline print:text-black text-sm font-semibold w-24 text-right shrink-0">
                  {item.customCost.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0 print:hidden"
                  onClick={() => {
                    if (item.isNew) {
                      removeItem(item.id);
                    } else if (isModified) {
                      resetItem(item.id);
                    } else {
                      updateItem(item.id, { isDeleted: true });
                    }
                  }}
                >
                  {!item.isNew && isModified ? (
                    <RotateCcw className="h-3 w-3" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </li>
            );
          })}

          <li className="pt-2 print:hidden">
            <Button
              className="w-full border-dashed border-2"
              variant="ghost"
              onClick={addItem}
            >
              <Plus className="h-4 w-4" />
              Adicionar Item Extra
            </Button>
          </li>
        </ul>
      )}

      <Separator />

      <div className="flex justify-between items-center font-semibold text-lg print:text-black">
        <span>Total Estimado</span>
        <span suppressHydrationWarning>
          {totalCost.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>
    </div>
  );
}
