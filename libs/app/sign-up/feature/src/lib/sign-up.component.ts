import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpPage {
  constructor(
    private router: Router){}

    SignUp()
    {
      this.router.navigate(['sign-up-categories']);
    }
}
