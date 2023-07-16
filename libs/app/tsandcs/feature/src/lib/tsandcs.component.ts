import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tsandcs',
  templateUrl: './tsandcs.component.html',
  styleUrls: ['./tsandcs.component.scss']
})
export class TsandcsPage {
  constructor(
    private router: Router){}


  openTeam(){
    this.router.navigate(['team']);
  }

  openPrivacy() {
    this.router.navigate(['privacy']);
  }

  home() {
    this.router.navigate(['']);
  }
}
