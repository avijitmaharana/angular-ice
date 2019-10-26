import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  number: number; res: number;
  constructor() { }
  ngOnInit() {
  }
  xibe(nm) {
    let a = 0; let b = nm;
    while (a <= b) {
      let m = Math.floor((a + b) / 2);
      if (m * m > nm) {
        b = m - 1;
      } else {
        a = m + 1;
      }
    }
    this.res = b;
  }

}














