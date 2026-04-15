"use server";

import { db } from "@/db";
import {
  drinkIngredients,
  drinks,
  eventDrinks,
  eventLabor,
  eventMaterials,
  events,
  ingredients,
  laborCatalog,
  materialCatalog,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
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

export type EventDrinkItem = {
  drinkId: number;
  drinkName: string;
  ingredients: { name: string; quantity: number; recipeUnit: string }[];
};

export const getEventDrinks = async (
  eventId: number,
): Promise<EventDrinkItem[]> => {
  const eventDrinkRows = await db
    .select({ drinkId: eventDrinks.drinkId, drinkName: drinks.name })
    .from(eventDrinks)
    .innerJoin(drinks, eq(drinks.id, eventDrinks.drinkId))
    .where(eq(eventDrinks.eventId, eventId));

  const result: EventDrinkItem[] = [];

  for (const row of eventDrinkRows) {
    const ingredientRows = await db
      .select({
        name: ingredients.name,
        quantity: drinkIngredients.quantity,
        recipeUnit: ingredients.recipeUnit,
      })
      .from(drinkIngredients)
      .innerJoin(ingredients, eq(ingredients.id, drinkIngredients.ingredientId))
      .where(eq(drinkIngredients.drinkId, row.drinkId));

    result.push({
      drinkId: row.drinkId,
      drinkName: row.drinkName,
      ingredients: ingredientRows.map((i) => ({
        ...i,
        quantity: Number(i.quantity),
      })),
    });
  }

  return result;
};

export type EventReport = {
  totalCostDrinks: number;
  totalCostLabor: number;
  totalCostMaterials: number;
  grandTotal: number;
};

export const getEventReport = async (eventId: number): Promise<EventReport> => {
  return db.transaction(async (tx) => {
    const [event] = await tx
      .select()
      .from(events)
      .where(eq(events.id, eventId));

    if (!event) {
      return {
        totalCostDrinks: 0,
        totalCostLabor: 0,
        totalCostMaterials: 0,
        grandTotal: 0,
      };
    }

    const eventDrinkRows = await tx
      .select({ drinkId: eventDrinks.drinkId })
      .from(eventDrinks)
      .where(eq(eventDrinks.eventId, eventId));

    const [laborRows, materialRows] = await Promise.all([
      tx
        .select({
          quantity: eventLabor.quantity,
          baseCost: laborCatalog.baseCost,
          baseHours: laborCatalog.baseHours,
          extraHourCost: laborCatalog.extraHourCost,
        })
        .from(eventLabor)
        .innerJoin(laborCatalog, eq(laborCatalog.id, eventLabor.laborCatalogId))
        .where(eq(eventLabor.eventId, eventId)),
      tx
        .select({
          quantity: eventMaterials.quantity,
          defaultCost: materialCatalog.defaultCost,
        })
        .from(eventMaterials)
        .innerJoin(
          materialCatalog,
          eq(materialCatalog.id, eventMaterials.materialCatalogId),
        )
        .where(eq(eventMaterials.eventId, eventId)),
    ]);

    let totalCostDrinks = 0;

    if (eventDrinkRows.length > 0) {
      const drinksPerType = event.totalDrinks / eventDrinkRows.length;
      const drinkIds = eventDrinkRows.map((r) => r.drinkId);

      const recipeRows = await tx
        .select({
          ingredientId: drinkIngredients.ingredientId,
          quantity: drinkIngredients.quantity,
          purchaseCost: ingredients.purchaseCost,
          yieldQuantity: ingredients.yieldQuantity,
        })
        .from(drinkIngredients)
        .innerJoin(
          ingredients,
          eq(ingredients.id, drinkIngredients.ingredientId),
        )
        .where(inArray(drinkIngredients.drinkId, drinkIds));

      const ingredientTotals = new Map<
        number,
        { purchaseCost: number; yieldQuantity: number; totalNeeded: number }
      >();

      for (const row of recipeRows) {
        const needed = Number(row.quantity) * drinksPerType;
        const existing = ingredientTotals.get(row.ingredientId);
        if (existing) {
          existing.totalNeeded += needed;
        } else {
          ingredientTotals.set(row.ingredientId, {
            purchaseCost: Number(row.purchaseCost),
            yieldQuantity: Number(row.yieldQuantity),
            totalNeeded: needed,
          });
        }
      }

      for (const ing of ingredientTotals.values()) {
        totalCostDrinks +=
          Math.ceil(ing.totalNeeded / ing.yieldQuantity) * ing.purchaseCost;
      }
    }

    const totalCostLabor = laborRows.reduce((acc, item) => {
      const extraHours = Math.max(0, event.durationHours - item.baseHours);
      return (
        acc +
        Number(item.quantity) *
          (Number(item.baseCost) + extraHours * Number(item.extraHourCost))
      );
    }, 0);

    const totalCostMaterials = materialRows.reduce(
      (acc, item) => acc + Number(item.quantity) * Number(item.defaultCost),
      0,
    );

    const grandTotal = totalCostDrinks + totalCostLabor + totalCostMaterials;

    return { totalCostDrinks, totalCostLabor, totalCostMaterials, grandTotal };
  });
};
