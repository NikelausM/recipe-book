import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";
import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions";
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // recipes: Recipe[] = [
  //   new Recipe('Sweet Potatoes', 
  //     'Delicious sweet potatoes.', 'https://www.simplyrecipes.com/thmb/IbY_MK3pA1G_ZHzWltgZCxe_OUk=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2012__07__grilled-sweet-potatoes-vertical-a-1600-0eafb4cd27b74617abb36379751eed51.jpg',
  //     [
  //       new Ingredient('Sweet Potato', 1),
  //       new Ingredient('Parsley Fries', 1)
  //     ]),
  //   new Recipe('Burger', 
  //     'Savoury burger.', 'https://natashaskitchen.com/wp-content/uploads/2019/04/Best-Burger-5.jpg',
  //     [
  //       new Ingredient('Ground Chuck Beef', 1),
  //       new Ingredient('Salt', 1),
  //       new Ingredient('Burger Bun', 1),
  //       new Ingredient('Sliced Chedder Cheese', 2),
  //       new Ingredient('Large Tomato', 0.5),
  //       new Ingredient('Green Leaf Lettuce', 1),
  //       new Ingredient('Medium Red Onion', 0.5),
  //       new Ingredient('Dill Pick Slices', 2),
  //     ]),
  //   new Recipe('Sandwich', 
  //     'Amazing sandwich.', 'https://assets.bonappetit.com/photos/59aec99643509c1d8b9371ee/6:9/w_3054,h_4581,c_limit/20170815%20MOB14283.jpg',
  //     [
  //       new Ingredient('Avocado', 1),
  //       new Ingredient('Bread Slice', 2),
  //       new Ingredient('Mozarella Cheese', 3),
  //       new Ingredient('Lettuce Leaf', 3)
  //     ])
  // ];
  private recipes: Recipe[] = [];

  constructor(
    private store: Store<fromShoppingList.AppState>
  ) { }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    // this.shoppingListService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }
  
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}