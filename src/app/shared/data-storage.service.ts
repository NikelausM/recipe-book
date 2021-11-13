import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http'
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap, take, exhaustMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) { }

  static get DATA_URL(): string {
    return 'https://ng-course-recipe-book-2d809-default-rtdb.firebaseio.com/';
  }

  static get recipesURL(): string {
    return [DataStorageService.DATA_URL, 'recipes.json'].join('/');
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(DataStorageService.recipesURL, recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(DataStorageService.recipesURL)
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}