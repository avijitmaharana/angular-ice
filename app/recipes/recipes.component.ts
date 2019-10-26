import { Component, OnInit, OnDestroy } from '@angular/core';

import { RecipesService } from './recipes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit, OnDestroy {
  private recFetchSubs = new Subscription
  constructor(private recipeSer: RecipesService) { }

  ngOnInit() {
    this.recFetchSubs = this.recipeSer.fetchRecipe().subscribe();
  }
  ngOnDestroy(){
    this.recFetchSubs.unsubscribe();
  }

}
