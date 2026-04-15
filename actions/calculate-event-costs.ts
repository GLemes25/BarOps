"use server";

import { db } from "@/db";
import { ingredients } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { getEventById } from "./get-event-by-id";
import type { ActionResult, EventCosts } from "./types";

const FOAM_INGREDIENTS = [
  "Xarope de açúcar",
  "Xarope de gengibre",
  "Emulsificante",
  "Suco de limão",
] as const;

export const calculateEventCosts = async (
  id: number,
): Promise<ActionResult<EventCosts>> => {
  try {
    const eventResult = await getEventById(id);
    if (!eventResult.success || !eventResult.data) {
      return { success: false, error: eventResult.error ?? "Event not found" };
    }

    const event = eventResult.data;

    const totalDrinks = Number(event.guests) * Number(event.avgDrinksPerPerson);

    const laborCost = event.labor.reduce(
      (acc, item) => acc + Number(item.quantity) * Number(item.costPerPerson),
      0,
    );

    const materialsCost = event.materials.reduce(
      (acc, item) => acc + Number(item.quantity) * Number(item.costPerUnit),
      0,
    );

    const foamIngredients = await db
      .select()
      .from(ingredients)
      .where(inArray(ingredients.name, [...FOAM_INGREDIENTS]));

    const foamIngredientsCost = foamIngredients.reduce(
      (acc, ingredient) =>
        acc + Number(ingredient.purchaseCost) / Number(ingredient.yieldQuantity),
      0,
    );

    return {
      success: true,
      data: { totalDrinks, laborCost, materialsCost, foamIngredientsCost },
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
