import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';

@Component({
  selector: 'privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyPage {

  constructor(@Inject(DOCUMENT) private document: Document,
    private router: Router){

      this.document.body.setAttribute('color-theme', 'light');
    }

    mobileview = false;

    ngOnInit() {
      this.updateMobileView();
      window.addEventListener('resize', this.updateMobileView.bind(this));
    }
    
    updateMobileView() {
      this.mobileview = window.innerWidth <= 992;
    }

  openTCs(){
    this.router.navigate(['tscs']);
  }

  openTeam() {
    this.router.navigate(['team']);
  }

  home() {
    this.router.navigate(['']);
  }

}
