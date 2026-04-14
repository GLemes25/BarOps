"use server";

import { db } from "@/db";
import { eventLabor, eventMaterials, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ActionResult, EventWithRelations } from "./types";

export const getEventById = async (
  id: number,
): Promise<ActionResult<EventWithRelations>> => {
  try {
    const [event] = await db.select().from(events).where(eq(events.id, id));

    if (!event) return { success: false, error: "Event not found" };

    const [labor, materials] = await Promise.all([
      db.select().from(eventLabor).where(eq(eventLabor.eventId, id)),
      db.select().from(eventMaterials).where(eq(eventMaterials.eventId, id)),
    ]);

    return { success: true, data: { ...event, labor, materials } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
