import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';


@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpPage {
 // collapse = false;
  profileModel = '';

  constructor(@Inject(DOCUMENT) private document: Document,
    private router: Router){
      this.document.body.setAttribute('color-theme', 'light');
    }


  openTeam(){
    this.router.navigate(['team']);
  }

  openTCs()
  {
    this.router.navigate(['tscs']); 
  }

  openPrivacy() {
    this.router.navigate(['privacy']);
  }


  home() {
    this.router.navigate(['']);
  }
  
}
