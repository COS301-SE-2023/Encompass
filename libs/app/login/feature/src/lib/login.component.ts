import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModel } from '@encompass/app/login/data-access';
import { login } from '@encompass/app/login/util';
import { Store } from '@ngxs/store';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginPage {
  user: LoginModel = new LoginModel();

  constructor(
    private router: Router, private store: Store){}

    LogIn()
    {
      this.store.dispatch(new login({email: this.user.email, password: this.user.password}));
      this.router.navigate(['home']);
    }
}
