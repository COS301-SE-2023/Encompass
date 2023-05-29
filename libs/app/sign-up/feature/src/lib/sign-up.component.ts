import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountDto } from '@encompass/api/account/data-access';
import { SignUpState } from '@encompass/app/sign-up/data-access';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
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
  
  user = {
    name: '',
    email:'',
    password: '',
  };

    SignUp()
    {
      this.store.dispatch(new signUp({email: this.values.email, password: this.values.password}));
      this.router.navigate(['sign-up-categories']);
    }
}
