"use client";

import type { EventDrinkItem } from "@/actions/event-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  drinks: EventDrinkItem[];
  totalDrinks: number;
};

export function EventDrinksSection({ drinks, totalDrinks }: Props) {
  if (drinks.length === 0) {
    return (
      <p className="text-muted-foreground">Nenhuma bebida adicionada ao evento.</p>
    );
  }

  const drinksPerType = totalDrinks / drinks.length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {totalDrinks} drinks totais · {drinks.length} tipo(s) ·{" "}
        {drinksPerType.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}{" "}
        por tipo
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {drinks.map((drink) => (
          <Card key={drink.drinkId}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{drink.drinkName}</CardTitle>
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
    </div>
  );
}
