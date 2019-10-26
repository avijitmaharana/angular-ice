import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipe.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit {
  recipe: Recipe;
  editMode: boolean = false;
  id: number;
  imageurl: string = null;
  recipeForm: FormGroup;
  constructor(private route: ActivatedRoute, private recipeServ: RecipesService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {
      this.editMode = param['id'] != null;
      this.id = +param['id'];
      this.forminIt();
    })
  }

  forminIt() {
    let nm = '';
    let des = '';
    let ingr = new FormArray([]);
    if (this.editMode) {
      const reci = this.recipeServ.getRecipe(this.id);
      this.imageurl = reci.imagePath;
      nm = reci.name;
      des = reci.description;
      if (reci.ingredients) {
        for (let ing of reci.ingredients) {
          ingr.push(
            new FormGroup({
              'name': new FormControl(ing.name, Validators.required),
              'amount': new FormControl(ing.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      'imagePath': new FormControl(this.imageurl, Validators.required, this.checkURL.bind(this)),
      'name': new FormControl(nm, Validators.required, this.onMatchingAsync.bind(this)),
      'description': new FormControl(des, Validators.required),
      'ingredients': ingr
    });
  }
  get controls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }
  addControls() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }
  nameErrorMessage() {
    return this.recipeForm.get('name').hasError('required') ? 'You must enter a name' :
      this.recipeForm.get('name').hasError('textIsForbidden') ? 'Recipe already exist!' :
        '';
  }
  imageErrorMessage() {
    return this.recipeForm.get('imagePath').hasError('required') ? 'You must enter a Image Url' :
      this.recipeForm.get('imagePath').hasError('imageUrlNotValid') ? 'The URL is not valid!' :
        '';
  }

  checkURL(control: FormControl): Promise<any> | Observable<any> {
    const prom = new Promise((resolve, reject) => {
      if (control.value.match(/\.(jpeg|jpg|gif|png)/) == null) {
        resolve({ 'imageUrlNotValid': true });
      } else {
        resolve(null);
        this.imageurl = control.value;
      }
    });
    return prom;
  }

  onMatchingAsync(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise((resolve, reject) => {
      const recipes = this.recipeServ.getRecipes();
      for (let rec of recipes) {
        if ((control.value === rec.name) && !this.editMode) {
          resolve({ 'textIsForbidden': true });
        }
      }
      resolve(null);
    });
    return promise;
  }
  removeIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
  onSubmit() {
    if (this.editMode) {
      this.recipeServ.updateRecipe(this.id, this.recipeForm.value);
      this.recipeServ.putRec();
    } else {
      this.recipeServ.addRecipe(this.recipeForm.value);
      this.recipeServ.putRec();
    }
    this.onCancel();
  }
  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
