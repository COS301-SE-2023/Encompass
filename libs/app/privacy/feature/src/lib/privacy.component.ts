import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyPage {

  constructor(
    private router: Router){}


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
