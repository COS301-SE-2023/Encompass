import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignUpModel } from '@encompass/app/sign-up/data-access';
import { Store } from '@ngxs/store';
import { CreateAccountRequest } from '@encompass/api/account/data-access';
import { signUp } from '@encompass/app/sign-up/util';
@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpPage {

  

  values: CreateAccountRequest = {"email": "test@frontend.com", "password": "12345678"};

  constructor(private router: Router, private store: Store){}

    user : SignUpModel = new SignUpModel();

    SignUp()
    {
      this.store.dispatch(new signUp({email: this.user.email, password: this.user.password}));
      this.router.navigate(['sign-up-categories']);
    }
}
