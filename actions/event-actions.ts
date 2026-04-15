"use server";

import { db } from "@/db";
import {
  drinkIngredients,
  eventDrinks,
  events,
  ingredients,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";

export type ShoppingListItem = {
  ingredientName: string;
  totalNeeded: number;
  recipeUnit: string;
  quantityToBuy: number;
  purchaseUnit: string;
  estimatedCost: number;
};

type EventInput = {
  name: string;
  date: string;
  guests: number;
  durationHours: number;
  avgDrinksPerPerson: number;
};

export const getEvents = async () => {
  const rows = await db.select().from(events);
  return rows.map((row) => ({
    ...row,
    date: row.date.toISOString(),
    avgDrinksPerPerson: Number(row.avgDrinksPerPerson),
  }));
};

export const deleteEvent = async (id: number): Promise<ActionResult> => {
  try {
    await db.delete(events).where(eq(events.id, id));
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const createEvent = async (
  values: EventInput,
): Promise<ActionResult<{ id: number }>> => {
  try {
    const totalDrinks = Math.round(values.guests * values.avgDrinksPerPerson);
    const [event] = await db
      .insert(events)
      .values({
        name: values.name,
        date: new Date(values.date),
        guests: values.guests,
        durationHours: values.durationHours,
        avgDrinksPerPerson: String(values.avgDrinksPerPerson),
        totalDrinks,
      })
      .returning({ id: events.id });
    revalidatePath("/events");
    return { success: true, data: { id: event.id } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const updateEvent = async (
  id: number,
  values: EventInput,
): Promise<ActionResult> => {
  try {
    const totalDrinks = Math.round(values.guests * values.avgDrinksPerPerson);
    await db
      .update(events)
      .set({
        name: values.name,
        date: new Date(values.date),
        guests: values.guests,
        durationHours: values.durationHours,
        avgDrinksPerPerson: String(values.avgDrinksPerPerson),
        totalDrinks,
      })
      .where(eq(events.id, id));
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const getEventShoppingList = async (
  eventId: number,
): Promise<ShoppingListItem[]> => {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId));

  if (!event) return [];

  const eventDrinkRows = await db
    .select({ drinkId: eventDrinks.drinkId })
    .from(eventDrinks)
    .where(eq(eventDrinks.eventId, eventId));

  if (eventDrinkRows.length === 0) return [];

  const drinkCount = eventDrinkRows.length;
  const drinksPerType = event.totalDrinks / drinkCount;

  const ingredientTotals = new Map<
    number,
    {
      name: string;
      recipeUnit: string;
      purchaseUnit: string;
      purchaseCost: number;
      yieldQuantity: number;
      totalNeeded: number;
    }
  >();

  for (const { drinkId } of eventDrinkRows) {
    const rows = await db
      .select({
        ingredientId: drinkIngredients.ingredientId,
        quantity: drinkIngredients.quantity,
        name: ingredients.name,
        recipeUnit: ingredients.recipeUnit,
        purchaseUnit: ingredients.purchaseUnit,
        purchaseCost: ingredients.purchaseCost,
        yieldQuantity: ingredients.yieldQuantity,
      })
      .from(drinkIngredients)
      .innerJoin(
        ingredients,
        eq(ingredients.id, drinkIngredients.ingredientId),
      )
      .where(eq(drinkIngredients.drinkId, drinkId));

    for (const row of rows) {
      const needed = Number(row.quantity) * drinksPerType;
      const existing = ingredientTotals.get(row.ingredientId);

      if (existing) {
        existing.totalNeeded += needed;
      } else {
        ingredientTotals.set(row.ingredientId, {
          name: row.name,
          recipeUnit: row.recipeUnit,
          purchaseUnit: row.purchaseUnit,
          purchaseCost: Number(row.purchaseCost),
          yieldQuantity: Number(row.yieldQuantity),
          totalNeeded: needed,
        });
      }
    }
  }

  return Array.from(ingredientTotals.values()).map((ing) => {
    const quantityToBuy = Math.ceil(ing.totalNeeded / ing.yieldQuantity);
    return {
      ingredientName: ing.name,
      totalNeeded: ing.totalNeeded,
      recipeUnit: ing.recipeUnit,
      quantityToBuy,
      purchaseUnit: ing.purchaseUnit,
      estimatedCost: quantityToBuy * ing.purchaseCost,
    };
  });
};
