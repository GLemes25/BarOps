"use server";

import { db } from "@/db";
import { drinks, eventDrinks, eventLabor, eventMaterials, events } from "@/db/schema";
import { count, eq, sql } from "drizzle-orm";
import type { ActionResult } from "./types";

export type DashboardStats = {
  totalEvents: number;
  estimatedRevenue: number;
  topDrink: string | null;
};

export const getDashboardStats = async (): Promise<ActionResult<DashboardStats>> => {
  try {
    const [{ totalEvents }] = await db
      .select({ totalEvents: count() })
      .from(events);

    const laborRows = await db
      .select({ quantity: eventLabor.quantity, costPerPerson: eventLabor.costPerPerson })
      .from(eventLabor);

    const materialRows = await db
      .select({ quantity: eventMaterials.quantity, costPerUnit: eventMaterials.costPerUnit })
      .from(eventMaterials);

    const laborCost = laborRows.reduce(
      (acc, row) => acc + Number(row.quantity) * Number(row.costPerPerson),
      0,
    );

    const materialsCost = materialRows.reduce(
      (acc, row) => acc + Number(row.quantity) * Number(row.costPerUnit),
      0,
    );

    const estimatedRevenue = laborCost + materialsCost;

    const topDrinkRows = await db
      .select({ drinkId: eventDrinks.drinkId, occurrences: count() })
      .from(eventDrinks)
      .groupBy(eventDrinks.drinkId)
      .orderBy(sql`count(*) desc`)
      .limit(1);

    let topDrink: string | null = null;

    if (topDrinkRows.length > 0) {
      const [drinkRow] = await db
        .select({ name: drinks.name })
        .from(drinks)
        .where(eq(drinks.id, topDrinkRows[0].drinkId))
        .limit(1);

      topDrink = drinkRow?.name ?? null;
    }

    return {
      success: true,
      data: { totalEvents, estimatedRevenue, topDrink },
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
