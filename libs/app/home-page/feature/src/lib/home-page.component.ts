import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePage {
  constructor(
    private router : Router
  ) {}

  GoToProfile()
  {
    this.router.navigate(['profile']);
  }
}
