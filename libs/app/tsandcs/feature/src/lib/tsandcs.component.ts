import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';

@Component({
  selector: 'tsandcs',
  templateUrl: './tsandcs.component.html',
  styleUrls: ['./tsandcs.component.scss'],
})
export class TsandcsPage {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {
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

  openTeam() {
    this.router.navigate(['team']);
  }

  openPrivacy() {
    this.router.navigate(['privacy']);
  }

  home() {
    this.router.navigate(['']);
  }
}
