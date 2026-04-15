import { getEventShoppingList } from "@/actions/event-actions";
import { getEventById } from "@/actions/get-event-by-id";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "./print-button";

dayjs.locale("pt-br");

type Props = {
  params: Promise<{ id: string }>;
};

const ShoppingListPage = async ({ params }: Props) => {
  const { id } = await params;
  const eventId = Number(id);

  if (isNaN(eventId)) notFound();

  const [eventResult, shoppingList] = await Promise.all([
    getEventById(eventId),
    getEventShoppingList(eventId),
  ]);

  if (!eventResult.success || !eventResult.data) notFound();

  const event = eventResult.data;

  const totalCost = shoppingList.reduce(
    (sum, item) => sum + item.estimatedCost,
    0,
  );

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between print:hidden">
        <Link
          href={`/events/${eventId}`}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Evento
        </Link>
        <PrintButton />
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Lista de Compras</h1>
        <p className="text-muted-foreground text-sm">
          {event.name} ·{" "}
          {dayjs(event.date).format("D [de] MMMM [de] YYYY")} ·{" "}
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
                <span className="font-semibold text-foreground">
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
        <span>
          {totalCost.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>
    </div>
  );
};

export default ShoppingListPage;
