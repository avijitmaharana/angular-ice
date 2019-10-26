import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoplistService } from './shoplist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[] = [];
  private subscr: Subscription;
  constructor(private ingredientServ: ShoplistService) { }

  ngOnInit() {
    this.ingredients = this.ingredientServ.getIngredients();
    this.subscr = this.ingredientServ.ingredientChanged.subscribe((ingredient:Ingredient[])=>{
      this.ingredients = ingredient;
    });
  }

  onEdit(index: number){
    this.ingredientServ.shopListEdit.next(index);
  }
  ngOnDestroy(){
    this.subscr.unsubscribe();
  }
}
