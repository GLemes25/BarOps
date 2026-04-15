"use client";

import type { EventDrinkItem } from "@/actions/event-actions";
import { removeDrinkFromEvent } from "@/actions/event-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EventDrinkForm } from "./event-drink-form";

type DrinkOption = { id: number; name: string };

type Props = {
  drinks: EventDrinkItem[];
  totalDrinks: number;
  eventId: number;
  availableDrinks: DrinkOption[];
};

export function EventDrinksSection({
  drinks,
  totalDrinks,
  eventId,
  availableDrinks,
}: Props) {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const drinksPerType = drinks.length > 0 ? totalDrinks / drinks.length : 0;

  const handleRemove = async (drinkId: number) => {
    await removeDrinkFromEvent(eventId, drinkId);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Drinks</h2>
        <Button onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Drink
        </Button>
      </div>

      {drinks.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma bebida adicionada ao evento.</p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {totalDrinks} drinks totais · {drinks.length} tipo(s) ·{" "}
            {drinksPerType.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}{" "}
            por tipo
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drinks.map((drink) => (
              <Card key={drink.drinkId}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{drink.drinkName}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(drink.drinkId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {drink.ingredients.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sem receita.</p>
                  ) : (
                    <ul className="text-sm space-y-1">
                      {drink.ingredients.map((ing) => (
                        <li key={ing.name} className="flex justify-between">
                          <span>{ing.name}</span>
                          <span className="text-muted-foreground">
                            {ing.quantity}
                            {ing.recipeUnit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Drink</DialogTitle>
          </DialogHeader>
          <EventDrinkForm
            eventId={eventId}
            availableDrinks={availableDrinks}
            onSuccess={() => {
              setIsAddOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
