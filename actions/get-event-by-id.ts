"use server";

import { db } from "@/db";
import {
  eventLabor,
  eventMaterials,
  events,
  laborCatalog,
  materialCatalog,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ActionResult, EventWithRelations } from "./types";

export const getEventById = async (
  id: number,
): Promise<ActionResult<EventWithRelations>> => {
  try {
    const [event] = await db.select().from(events).where(eq(events.id, id));

    if (!event) return { success: false, error: "Event not found" };

    const [laborRows, materialRows] = await Promise.all([
      db
        .select({
          id: eventLabor.id,
          eventId: eventLabor.eventId,
          laborCatalogId: eventLabor.laborCatalogId,
          quantity: eventLabor.quantity,
          role: laborCatalog.role,
          baseCost: laborCatalog.baseCost,
          baseHours: laborCatalog.baseHours,
          extraHourCost: laborCatalog.extraHourCost,
        })
        .from(eventLabor)
        .innerJoin(laborCatalog, eq(laborCatalog.id, eventLabor.laborCatalogId))
        .where(eq(eventLabor.eventId, id)),
      db
        .select({
          id: eventMaterials.id,
          eventId: eventMaterials.eventId,
          materialCatalogId: eventMaterials.materialCatalogId,
          quantity: eventMaterials.quantity,
          name: materialCatalog.name,
          defaultCost: materialCatalog.defaultCost,
        })
        .from(eventMaterials)
        .innerJoin(
          materialCatalog,
          eq(materialCatalog.id, eventMaterials.materialCatalogId),
        )
        .where(eq(eventMaterials.eventId, id)),
    ]);

    const labor = laborRows.map((row) => ({
      ...row,
      baseCost: Number(row.baseCost),
      extraHourCost: Number(row.extraHourCost),
    }));

    const materials = materialRows.map((row) => ({
      ...row,
      defaultCost: Number(row.defaultCost),
    }));

    return { success: true, data: { ...event, labor, materials } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
