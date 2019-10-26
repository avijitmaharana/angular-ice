import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { ShoplistService } from 'src/app/shopping-list/shoplist.service';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  // @Input() recipe: Recipe;
  recipe: Recipe;
  id: number;
  constructor(private shopList: ShoplistService, private recipeServ: RecipesService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // const id = +this.route.snapshot.params['id']; 

    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeServ.getRecipe(+params['id']);
      }
    )
  }
  addToShop() {
    // for(let i in this.recipe.ingredients){
    //   const ingr = new Ingredient(this.recipe.ingredients[i].name,this.recipe.ingredients[i].amount);
    this.shopList.addIngArray(this.recipe.ingredients);
    // }
  }
  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
  onDelete() {
    this.recipeServ.deleteRecipe(this.id);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
