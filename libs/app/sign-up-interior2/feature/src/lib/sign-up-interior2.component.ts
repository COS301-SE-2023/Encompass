import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'sign-up-interior2',
  templateUrl: './sign-up-interior2.component.html',
  styleUrls: ['./sign-up-interior2.component.scss']
})
export class SignUpInterior2Page{
  constructor(
    private router: Router){}

  done()
  {
    this.router.navigate(['']);
  }
}
