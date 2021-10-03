import { Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {

  recipes: Recipe[] = [
    new Recipe('Sweet Potatoes', 
      'Delicious sweet potatoes.', 'https://www.simplyrecipes.com/thmb/IbY_MK3pA1G_ZHzWltgZCxe_OUk=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2012__07__grilled-sweet-potatoes-vertical-a-1600-0eafb4cd27b74617abb36379751eed51.jpg',
      [
        new Ingredient('Sweet Potato', 1),
        new Ingredient('Parsley Fries', 1)
      ]),
    new Recipe('Burger', 
      'Savoury burger.', 'https://natashaskitchen.com/wp-content/uploads/2019/04/Best-Burger-5.jpg',
      [
        new Ingredient('Ground Chuck Beef', 1),
        new Ingredient('Salt', 1),
        new Ingredient('Burger Bun', 1),
        new Ingredient('Sliced Chedder Cheese', 2),
        new Ingredient('Large Tomato', 0.5),
        new Ingredient('Green Leaf Lettuce', 1),
        new Ingredient('Medium Red Onion', 0.5),
        new Ingredient('Dill Pick Slices', 2),
      ])
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    this.shoppingListService.addIngredients(ingredients);
  }
}