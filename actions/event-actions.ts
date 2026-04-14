"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./types";

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
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
