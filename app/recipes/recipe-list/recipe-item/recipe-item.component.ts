import { Component, OnInit, Input } from '@angular/core';

import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() i: number;
  // @Output() recipeSelected = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onSelected() {
    // this.route.navigate([this.i], {relativeTo: this.router});

    // this.recSrev.selectedReceipe.emit(this.recipe);
    // this.recipeSelected.emit();
  }

}
