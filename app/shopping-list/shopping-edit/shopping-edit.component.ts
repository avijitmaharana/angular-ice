import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoplistService } from '../shoplist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: true }) sForm: NgForm;
  editMode: boolean = false;
  index: number;
  subscription: Subscription;
  constructor(private ingredientServ: ShoplistService) { }

  ngOnInit() {
    this.subscription = this.ingredientServ.shopListEdit.subscribe((i: number) => {
      this.index = i;
      const ing = this.ingredientServ.getIngredient(i);
      this.sForm.setValue({ name: ing.name, amount: ing.amount });
      this.editMode = true;
    });
    this.editMode = false;
  }

  onSubmit(form: NgForm) {
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.ingredientServ.editIngredient(this.index, newIngredient);
      form.resetForm();
      this.editMode = false;
    } else {
      this.ingredientServ.addIngredient(newIngredient);
      form.resetForm();
    }
  }
  onDelete() {
    if (this.editMode) {
      this.ingredientServ.deleteIngredient(this.index);
      this.sForm.resetForm();
      this.editMode = false;
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
