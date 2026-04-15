import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { ingredients, drinks, drinkIngredients, laborCatalog, materialCatalog } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log("Seeding database...");

  // Insert ingredients
  const insertedIngredients = await db
    .insert(ingredients)
    .values([
      { name: "Suco de limão",       recipeUnit: "ml", purchaseUnit: "Garrafa 1L",    purchaseCost: "20.00", yieldQuantity: "1000" },
      { name: "Vodka",               recipeUnit: "ml", purchaseUnit: "Garrafa 1L",    purchaseCost: "80.00", yieldQuantity: "1000" },
      { name: "Gin",                 recipeUnit: "ml", purchaseUnit: "Garrafa 1L",    purchaseCost: "120.00", yieldQuantity: "1000" },
      { name: "Rum",                 recipeUnit: "ml", purchaseUnit: "Garrafa 1L",    purchaseCost: "70.00", yieldQuantity: "1000" },
      { name: "Xarope de açúcar",    recipeUnit: "ml", purchaseUnit: "Garrafa 1L",    purchaseCost: "15.00", yieldQuantity: "1000" },
      { name: "Xarope de gengibre",  recipeUnit: "ml", purchaseUnit: "Garrafa 500ml", purchaseCost: "15.00", yieldQuantity: "500" },
      { name: "Emulsificante",       recipeUnit: "ml", purchaseUnit: "Garrafa 500ml", purchaseCost: "25.00", yieldQuantity: "500" },
      { name: "Polpa de maracujá",   recipeUnit: "ml", purchaseUnit: "Pacote 1L",     purchaseCost: "25.00", yieldQuantity: "1000" },
      { name: "Energético tropical", recipeUnit: "ml", purchaseUnit: "Lata 355ml",    purchaseCost: "21.30", yieldQuantity: "355" },
      { name: "Água tônica",         recipeUnit: "ml", purchaseUnit: "Garrafa 350ml", purchaseCost: "6.30",  yieldQuantity: "350" },
      { name: "Gelo",                recipeUnit: "g",  purchaseUnit: "Saco 5Kg",      purchaseCost: "5.00",  yieldQuantity: "5000" },
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

  await db.insert(laborCatalog).values([
    { role: "Bartender",    baseCost: "180.00", baseHours: 5, extraHourCost: "60.00" },
    { role: "Garçom",       baseCost: "120.00", baseHours: 5, extraHourCost: "40.00" },
    { role: "Barback",      baseCost: "100.00", baseHours: 5, extraHourCost: "35.00" },
  ]);
  console.log("Inserted labor_catalog.");

  await db.insert(materialCatalog).values([
    { name: "Balcão de bar",      defaultCost: "150.00" },
    { name: "Coqueteleira",       defaultCost: "30.00"  },
    { name: "Copo long drink",    defaultCost: "2.50"   },
    { name: "Copo de shot",       defaultCost: "1.50"   },
  ]);
  console.log("Inserted material_catalog.");

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
