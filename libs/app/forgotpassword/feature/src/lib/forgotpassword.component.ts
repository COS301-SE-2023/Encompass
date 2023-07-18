import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordPage {

  constructor(
    private router: Router){}


  Back(){
    this.router.navigate(['login']);
  }
}
