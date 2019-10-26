import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { RecipesService } from './recipes.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(private recipeServ: RecipesService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const rec = this.recipeServ.getRecipes();
    if (rec.length === 0) {
      return this.recipeServ.fetchRecipe();
    } else {
      return rec;
    }
  }
}
