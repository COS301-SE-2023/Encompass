import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';


@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamPage {

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

  openPrivacy() {
    this.router.navigate(['privacy']);
  }

  home() {
    this.router.navigate(['']);
  }
}
