import type { ShoppingListItem } from "@/actions/event-actions";
import type { EventWithRelations } from "@/actions/types";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { PrintButton } from "./print-button";

dayjs.locale("pt-br");

type Props = {
  event: EventWithRelations;
  shoppingList: ShoppingListItem[];
};

export function ShoppingListSection({ event, shoppingList }: Props) {
  const totalCost = shoppingList.reduce(
    (sum, item) => sum + item.estimatedCost,
    0,
  );

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-end print:hidden">
        <PrintButton />
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Lista de Compras</h1>
        <p className="text-muted-foreground text-sm">
          {event.name} · {dayjs(event.date).format("D [de] MMMM [de] YYYY")} ·{" "}
          {event.guests} convidado{event.guests !== 1 ? "s" : ""}
        </p>
      </div>

      <Separator />

      {shoppingList.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum ingrediente encontrado para este evento.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {shoppingList.map((item) => (
            <li
              key={item.ingredientName}
              className="flex items-baseline justify-between gap-4 py-2 border-b last:border-0"
            >
              <span className="font-medium">{item.ingredientName}</span>
              <span className="text-right text-sm text-muted-foreground shrink-0">
                Comprar{" "}
                <span className="font-semibold text-foreground">
                  {item.quantityToBuy} {item.purchaseUnit}
                </span>{" "}
                · Custo:{" "}
                <span suppressHydrationWarning className="font-semibold text-foreground">
                  {item.estimatedCost.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <Separator />

      <div className="flex justify-between items-center font-semibold text-lg">
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
