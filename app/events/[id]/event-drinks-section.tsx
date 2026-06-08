"use client";

import type { EventDrinkItem } from "@/actions/event-actions";
import { addDrinkToEvent, removeDrinkFromEvent } from "@/actions/event-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type DrinkVariant = { id: number; name: string };

type DrinkOption = {
  id: number;
  name: string;
  parentId: number | null;
  variants: DrinkVariant[];
};

type Props = {
  drinks: EventDrinkItem[];
  totalDrinks: number;
  eventId: number;
  availableDrinks: DrinkOption[];
};

export const EventDrinksSection = ({
  drinks,
  totalDrinks,
  eventId,
  availableDrinks,
}: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  const drinksPerType = drinks.length > 0 ? totalDrinks / drinks.length : 0;

  const toggleDrink = (drinkId: number, isSelected: boolean) => {
    startTransition(async () => {
      if (isSelected) {
        await removeDrinkFromEvent(eventId, drinkId);
      } else {
        await addDrinkToEvent(eventId, drinkId);
      }
      router.refresh();
    });
  };

  const toggleAllVariants = (
    drink: DrinkOption,
    isAllSelected: boolean,
    e: React.MouseEvent | React.KeyboardEvent,
  ) => {
    e.preventDefault();
    startTransition(async () => {
      const promises = drink.variants.map(async (variant) => {
        const isSelected = drinks.some((d) => d.drinkId === variant.id);
        if (isAllSelected && isSelected) {
          return removeDrinkFromEvent(eventId, variant.id);
        }
        if (!isAllSelected && !isSelected) {
          return addDrinkToEvent(eventId, variant.id);
        }
      });
      await Promise.all(promises);
      router.refresh();
    });
  };

  const isDrinkSelected = (drink: DrinkOption) =>
    drink.variants.length > 0
      ? drink.variants.some((v) => drinks.some((d) => d.drinkId === v.id))
      : drinks.some((d) => d.drinkId === drink.id);

  const masterDrinks = availableDrinks
    .filter((d) => d.parentId === null)
    .filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const isASelected = isDrinkSelected(a);
      const isBSelected = isDrinkSelected(b);
      if (isASelected && !isBSelected) return -1;
      if (isBSelected && !isASelected) return 1;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Drinks</h2>
        <p className="text-sm text-muted-foreground">
          {totalDrinks} drinks totais · {drinks.length} tipo(s) ·{" "}
          {drinksPerType.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}{" "}
          por tipo
        </p>
      </div>

      <Input
        placeholder="Buscar drink..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-opacity ${
          isPending ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        {masterDrinks.map((drink) => {
          const hasVariants = drink.variants.length > 0;

          if (!hasVariants) {
            const isSelected = drinks.some((d) => d.drinkId === drink.id);
            return (
              <Card
                key={drink.id}
                className={`cursor-pointer transition-all active:scale-95 focus-within:opacity-90 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "opacity-60 hover:opacity-100"
                }`}
                onClick={() => toggleDrink(drink.id, isSelected)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleDrink(drink.id, isSelected);
                  }
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{drink.name}</CardTitle>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardHeader>
              </Card>
            );
          }

          const selectedVariantsCount = drink.variants.filter((variant) =>
            drinks.some((d) => d.drinkId === variant.id),
          ).length;
          const hasSelection = selectedVariantsCount > 0;
          const isAllSelected = selectedVariantsCount === drink.variants.length;

          return (
            <Card
              key={drink.id}
              className={`cursor-pointer transition-all focus-within:opacity-90 ${
                hasSelection
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "opacity-60 hover:opacity-100"
              }`}
              onClick={(e) => toggleAllVariants(drink, isAllSelected, e)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  toggleAllVariants(drink, isAllSelected, e);
                }
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{drink.name}</CardTitle>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {selectedVariantsCount}/{drink.variants.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {drink.variants.map((variant) => {
                    const isSelected = drinks.some(
                      (d) => d.drinkId === variant.id,
                    );
                    return (
                      <Button
                        key={variant.id}
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        disabled={isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDrink(variant.id, isSelected);
                        }}
                        className="focus-visible:opacity-90 focus-visible:outline-none"
                      >
                        {isSelected && (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        )}
                        {variant.name}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
