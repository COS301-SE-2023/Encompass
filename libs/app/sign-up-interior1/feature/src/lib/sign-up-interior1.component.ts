import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sign-up-interior1',
  templateUrl: './sign-up-interior1.component.html',
  styleUrls: ['./sign-up-interior1.component.scss']
})
export class SignUpInterior1Page {
  constructor(
    private router: Router){}
  
  next()
  {
    this.router.navigate(['sign-up-communities']);
  }
}
