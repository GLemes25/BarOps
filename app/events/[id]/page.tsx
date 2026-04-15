import { getEventShoppingList } from "@/actions/event-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

const EventDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const eventId = Number(id);

  if (isNaN(eventId)) notFound();

  const shoppingList = await getEventShoppingList(eventId);

  const totalCost = shoppingList.reduce(
    (sum, item) => sum + item.estimatedCost,
    0,
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Compras de Ingredientes</h1>

      {shoppingList.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum ingrediente encontrado para este evento.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingrediente</TableHead>
              <TableHead>Total Necessário</TableHead>
              <TableHead>Quantidade a Comprar</TableHead>
              <TableHead>Custo Estimado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shoppingList.map((item) => (
              <TableRow key={item.ingredientName}>
                <TableCell>{item.ingredientName}</TableCell>
                <TableCell>
                  {item.totalNeeded.toLocaleString("pt-BR", {
                    maximumFractionDigits: 2,
                  })}{" "}
                  {item.recipeUnit}
                </TableCell>
                <TableCell>
                  {item.quantityToBuy} {item.purchaseUnit}
                </TableCell>
                <TableCell>
                  {item.estimatedCost.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="font-semibold">
                Total Estimado
              </TableCell>
              <TableCell className="font-semibold">
                {totalCost.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
};

export default EventDetailPage;
