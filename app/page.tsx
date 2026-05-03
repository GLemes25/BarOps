import { getDashboardStats } from "@/actions/dashboard-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, GlassWater, TrendingUp } from "lucide-react";

const DashboardPage = async () => {
  const result = await getDashboardStats();
  const stats = result.success && result.data ? result.data : null;

  const totalEvents = stats?.totalEvents ?? 0;
  const estimatedRevenue = stats?.estimatedRevenue ?? 0;
  const topDrink = stats?.topDrink ?? "—";

  const formattedRevenue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(estimatedRevenue);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
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
              eventos cadastrados
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
              soma dos custos dos eventos
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
    </div>
  );
};

export default DashboardPage;
