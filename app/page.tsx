import { getEvents } from "@/actions/event-actions";
import { getDashboardStats } from "@/actions/dashboard-actions";
import { EventsCalendar } from "@/components/events-calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, GlassWater, TrendingUp } from "lucide-react";

const DashboardPage = async () => {
  const [statsResult, events] = await Promise.all([
    getDashboardStats(),
    getEvents(),
  ]);

  const stats = statsResult.success && statsResult.data ? statsResult.data : null;

  const totalEvents = stats?.totalEvents ?? 0;
  const estimatedRevenue = stats?.estimatedRevenue ?? 0;
  const topDrink = stats?.topDrink ?? "—";

  const formattedRevenue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(estimatedRevenue);

  const calendarEvents = events.map((e) => ({
    id: e.id,
    name: e.name,
    date: e.date,
    status: e.status,
  }));

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral das operações do bar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Eventos
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{totalEvents}</p>
            <CardDescription className="mt-1">
              Eventos cadastrados
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Estimada
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {formattedRevenue}
            </p>
            <CardDescription className="mt-1">
              Soma dos custos dos eventos
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bebida Mais Pedida
            </CardTitle>
            <GlassWater className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{topDrink}</p>
            <CardDescription className="mt-1">
              mais frequente nos eventos
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Calendário de Eventos
          </CardTitle>
          <CardDescription>Visualize os eventos por período</CardDescription>
        </CardHeader>
        <CardContent>
          <EventsCalendar events={calendarEvents} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
