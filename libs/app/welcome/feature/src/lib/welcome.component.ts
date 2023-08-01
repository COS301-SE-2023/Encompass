import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomePage {
  constructor(@Inject(DOCUMENT) private document: Document,
    private router: Router){
      this.document.body.setAttribute('color-theme', 'light');
    }

    LogIn()
    {
      this.router.navigate(['login']);
    }

    SignUp()
    {
      this.router.navigate(['register']);
    }

    openTeam() {
      this.router.navigate(['team']);
    }

    openTCs(){
      this.router.navigate(['tscs']);
    }

    openPrivacy() {
      this.router.navigate(['privacy']);
    }
}
