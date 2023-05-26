import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomePage {
  constructor(
    private router: Router){}

    LogIn()
    {
      this.router.navigate(['login']);
    }

    SignUp()
    {
      this.router.navigate(['register']);
    }
}
