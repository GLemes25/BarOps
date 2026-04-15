import { getDrinks } from "@/actions/drink-actions";
import { getIngredients } from "@/actions/ingredient-actions";
import { DrinksTable } from "./drinks-table";

const DrinksPage = async () => {
  const [drinks, ingredients] = await Promise.all([getDrinks(), getIngredients()]);

  const availableIngredients = ingredients.map((ing) => ({
    id: ing.id,
    name: ing.name,
    recipeUnit: ing.recipeUnit,
  }));

  return <DrinksTable initialData={drinks} availableIngredients={availableIngredients} />;
};

export default DrinksPage;
