import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators'
import { global } from '../shared/global.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  onRecipeChange = new Subject<Recipe[]>();
  constructor(private http: HttpClient, private global: global, private authServ: AuthService) { }
  private recipes: Recipe[] = [
    // new Recipe('Jackfruit Chilli',
    //   'If you \'d like to lose weight.',
    //   'https://asset.slimmingworld.co.uk/content/media/11596/jackfruit-chilli-iceland_sw_recipe.jpg?v1=JGXiore20qg9NNIj0tmc3TKfKw-jr0s127JqqpCA2x7sMviNgcAYh1epuS_Lqxebn9V_qusKHfwbF7MOUrAPptzBhXIUL1Xnq2Mmdvx4fOk&width=552&height=552',
    //   [
    //     new Ingredient('jackfruit', 10),
    //     new Ingredient('soya', 5)
    //   ]),

    // new Recipe('Fried Rice',
    //   'This is a vegan lunch.',
    //   'https://holycowvegan.net/wp-content/uploads/2019/10/lemon-garlic-rice-15-680x764.jpg',
    //   [
    //     new Ingredient('paneer', 10),
    //     new Ingredient('rice', 4)
    //   ]),
    // new Recipe('Paneer Tikka',
    //   'Healthy & tasty that you cant stop licking your finger. This is a vegan lunch.',
    //   'https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/goulash.jpg',
    //   [
    //     new Ingredient('paneer', 12),
    //     new Ingredient('butter', 2),
    //     new Ingredient('mayonnaise', 1)
    //   ])
  ];

  putRec() {
    const recipes = this.getRecipes();
    let tok;
    this.authServ.user.pipe(take(1)).subscribe(use => tok = use.token );
    this.http.put<Recipe[]>(this.global.apiUrl + 'recipes.json?auth=' + tok, recipes).subscribe();
  }
  fetchRecipe() {
    return this.authServ.user.pipe(take(1), exhaustMap(user => {
      return this.http.get<Recipe[]>(this.global.apiUrl + 'recipes.json',
        {
          params: new HttpParams().set('auth', user.token)
        }
      )
    }),
      map(rec => {
        return rec.map(reci => {
          return {
            ...reci, ingredients: reci.ingredients ? reci.ingredients : []
          };
        });
      }),
      tap(reci => {
        this.recipes = reci;
        this.onRecipeChange.next(this.recipes.slice());
      })
    )
  }

  getRecipes() {
    return this.recipes.slice();
  }
  getRecipe(id: number) {
    return this.recipes[id];
  }
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.onRecipeChange.next(this.recipes.slice());
  }
  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.onRecipeChange.next(this.recipes.slice());
  }
  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.onRecipeChange.next(this.recipes.slice());
  }
}
