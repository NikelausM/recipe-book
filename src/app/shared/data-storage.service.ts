import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  public static readonly DATA_URL = 'https://ng-course-recipe-book-2d809-default-rtdb.firebaseio.com/';

  constructor() { }

  static get recipesURL(): string {
    return [DataStorageService.DATA_URL, 'recipes.json'].join('/');
  }
}