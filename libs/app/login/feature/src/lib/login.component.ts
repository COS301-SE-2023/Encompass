import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginPage {
  constructor(
    private router: Router){}

    LogIn()
    {
      this.store.dispatch(new LogIn({name: this.user.name, password: this.user.password}));
      this.router.navigate(['home']);
    }
}
