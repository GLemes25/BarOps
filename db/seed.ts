import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { ingredients, drinks, drinkIngredients } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log("Seeding database...");

  // Insert ingredients
  const insertedIngredients = await db
    .insert(ingredients)
    .values([
      { name: "Suco de limão",       unit: "ml", costPerUnit: "0.0200" },
      { name: "Vodka",               unit: "ml", costPerUnit: "0.0800" },
      { name: "Gin",                 unit: "ml", costPerUnit: "0.1200" },
      { name: "Rum",                 unit: "ml", costPerUnit: "0.0700" },
      { name: "Xarope de açúcar",    unit: "ml", costPerUnit: "0.0150" },
      { name: "Xarope de gengibre",  unit: "ml", costPerUnit: "0.0300" },
      { name: "Emulsificante",       unit: "ml", costPerUnit: "0.0500" },
      { name: "Polpa de maracujá",   unit: "ml", costPerUnit: "0.0250" },
      { name: "Energético tropical", unit: "ml", costPerUnit: "0.0600" },
      { name: "Água tônica",         unit: "ml", costPerUnit: "0.0180" },
      { name: "Gelo",                unit: "g",  costPerUnit: "0.0010" },
    ])
    .returning();

  const byName = Object.fromEntries(
    insertedIngredients.map((i) => [i.name, i.id])
  );

  console.log(`Inserted ${insertedIngredients.length} ingredients.`);

  // Insert drinks
  const insertedDrinks = await db
    .insert(drinks)
    .values([
      { name: "Caipirinha de Limão" },
      { name: "Gin Tônica" },
      { name: "Mojito" },
      { name: "Gin Tropical" },
      { name: "Moscow Mule" },
    ])
    .returning();

  const drinkByName = Object.fromEntries(
    insertedDrinks.map((d) => [d.name, d.id])
  );

  console.log(`Inserted ${insertedDrinks.length} drinks.`);

  // Insert drink_ingredients relationships
  await db.insert(drinkIngredients).values([
    // Caipirinha de Limão
    { drinkId: drinkByName["Caipirinha de Limão"], ingredientId: byName["Rum"],              quantity: "50" },
    { drinkId: drinkByName["Caipirinha de Limão"], ingredientId: byName["Suco de limão"],    quantity: "30" },
    { drinkId: drinkByName["Caipirinha de Limão"], ingredientId: byName["Xarope de açúcar"], quantity: "15" },
    { drinkId: drinkByName["Caipirinha de Limão"], ingredientId: byName["Gelo"],             quantity: "150" },

    // Gin Tônica
    { drinkId: drinkByName["Gin Tônica"], ingredientId: byName["Gin"],          quantity: "50" },
    { drinkId: drinkByName["Gin Tônica"], ingredientId: byName["Água tônica"],  quantity: "150" },
    { drinkId: drinkByName["Gin Tônica"], ingredientId: byName["Gelo"],         quantity: "150" },

    // Mojito
    { drinkId: drinkByName["Mojito"], ingredientId: byName["Rum"],              quantity: "50" },
    { drinkId: drinkByName["Mojito"], ingredientId: byName["Suco de limão"],    quantity: "30" },
    { drinkId: drinkByName["Mojito"], ingredientId: byName["Xarope de açúcar"], quantity: "15" },
    { drinkId: drinkByName["Mojito"], ingredientId: byName["Gelo"],             quantity: "150" },

    // Gin Tropical
    { drinkId: drinkByName["Gin Tropical"], ingredientId: byName["Gin"],                 quantity: "50" },
    { drinkId: drinkByName["Gin Tropical"], ingredientId: byName["Polpa de maracujá"],   quantity: "40" },
    { drinkId: drinkByName["Gin Tropical"], ingredientId: byName["Energético tropical"], quantity: "100" },
    { drinkId: drinkByName["Gin Tropical"], ingredientId: byName["Gelo"],                quantity: "150" },

    // Moscow Mule (Vodka + Suco de Limão + Espuma: Xarope de açúcar + Xarope de gengibre + Emulsificante)
    { drinkId: drinkByName["Moscow Mule"], ingredientId: byName["Vodka"],               quantity: "50" },
    { drinkId: drinkByName["Moscow Mule"], ingredientId: byName["Suco de limão"],       quantity: "20" },
    { drinkId: drinkByName["Moscow Mule"], ingredientId: byName["Xarope de açúcar"],    quantity: "15" },
    { drinkId: drinkByName["Moscow Mule"], ingredientId: byName["Xarope de gengibre"],  quantity: "15" },
    { drinkId: drinkByName["Moscow Mule"], ingredientId: byName["Emulsificante"],        quantity: "5" },
    { drinkId: drinkByName["Moscow Mule"], ingredientId: byName["Gelo"],                quantity: "150" },
  ]);

  console.log("Inserted drink_ingredients relationships.");
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
