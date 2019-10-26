import { Component, OnInit, OnDestroy } from '@angular/core';

import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  // @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[];
  subscription: Subscription;
  constructor(private recipeServ: RecipesService) { }

  ngOnInit() {
    this.subscription = this.recipeServ.onRecipeChange.subscribe(
      (rec: Recipe[])=>{
        this.recipes = rec;
      }
    );
    this.recipes = this.recipeServ.getRecipes();
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
