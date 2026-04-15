import {
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  guests: integer("guests").notNull(),
  durationHours: integer("duration_hours").notNull(),
  avgDrinksPerPerson: decimal("avg_drinks_per_person", {
    precision: 5,
    scale: 2,
  }).notNull(),
  totalDrinks: integer("total_drinks").notNull(),
});

export const drinks = pgTable("drinks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  recipeUnit: text("recipe_unit").notNull(),
  purchaseUnit: text("purchase_unit").notNull(),
  purchaseCost: decimal("purchase_cost", { precision: 10, scale: 2 }).notNull(),
  yieldQuantity: decimal("yield_quantity", { precision: 10, scale: 4 }).notNull(),
});

export const drinkIngredients = pgTable("drink_ingredients", {
  id: serial("id").primaryKey(),
  drinkId: integer("drink_id")
    .notNull()
    .references(() => drinks.id),
  ingredientId: integer("ingredient_id")
    .notNull()
    .references(() => ingredients.id),
  quantity: decimal("quantity", { precision: 10, scale: 4 }).notNull(),
});

export const eventLabor = pgTable("event_labor", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id),
  role: text("role").notNull(),
  quantity: integer("quantity").notNull(),
  costPerPerson: decimal("cost_per_person", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const eventMaterials = pgTable("event_materials", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 2 }).notNull(),
});

export const eventDrinks = pgTable("event_drinks", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id),
  drinkId: integer("drink_id")
    .notNull()
    .references(() => drinks.id),
});
