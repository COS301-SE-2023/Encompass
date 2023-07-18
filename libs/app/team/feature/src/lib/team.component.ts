import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamPage {

  constructor(
    private router: Router){}


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
