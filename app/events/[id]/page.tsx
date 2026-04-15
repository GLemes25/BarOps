import {
  getEventDrinks,
  getEventShoppingList,
} from "@/actions/event-actions";
import { getEventById } from "@/actions/get-event-by-id";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { notFound } from "next/navigation";
import { EventDrinksSection } from "./event-drinks-section";
import { EventFinancialSection } from "./event-financial-section";
import { EventLaborSection } from "./event-labor-section";
import { EventMaterialsSection } from "./event-materials-section";

dayjs.locale("pt-br");

type Props = {
  params: Promise<{ id: string }>;
};

const EventDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const eventId = Number(id);

  if (isNaN(eventId)) notFound();

  const [eventResult, eventDrinks, shoppingList] = await Promise.all([
    getEventById(eventId),
    getEventDrinks(eventId),
    getEventShoppingList(eventId),
  ]);

  if (!eventResult.success || !eventResult.data) notFound();

  const event = eventResult.data;

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <Badge variant="secondary">
            {event.guests} convidado{event.guests !== 1 ? "s" : ""}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          {dayjs(event.date).format("dddd, D [de] MMMM [de] YYYY")} ·{" "}
          {event.durationHours}h de duração
        </p>
      </div>

      <Tabs defaultValue="drinks">
        <TabsList>
          <TabsTrigger value="drinks">Drinks</TabsTrigger>
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
          <TabsTrigger value="materiais">Materiais</TabsTrigger>
          <TabsTrigger value="financeiro">Resumo Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="drinks" className="mt-4">
          <EventDrinksSection
            drinks={eventDrinks}
            totalDrinks={event.totalDrinks}
          />
        </TabsContent>

        <TabsContent value="equipe" className="mt-4">
          <EventLaborSection
            labor={event.labor}
            durationHours={event.durationHours}
          />
        </TabsContent>

        <TabsContent value="materiais" className="mt-4">
          <EventMaterialsSection materials={event.materials} />
        </TabsContent>

        <TabsContent value="financeiro" className="mt-4">
          <EventFinancialSection
            labor={event.labor}
            materials={event.materials}
            shoppingList={shoppingList}
            durationHours={event.durationHours}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventDetailPage;
