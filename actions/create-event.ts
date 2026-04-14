"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import type { ActionResult, CreateEventInput } from "./types";

export const createEvent = async (
  input: CreateEventInput,
): Promise<ActionResult<{ id: number }>> => {
  try {
    const [event] = await db
      .insert(events)
      .values(input)
      .returning({ id: events.id });
    return { success: true, data: { id: event.id } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
