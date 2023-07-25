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


    buttonStates: { [key: string]: boolean } = {}; // Object to track state for each button

    handleButtonClick(buttonId: string) {
      this.buttonStates[buttonId] = !this.buttonStates[buttonId];
    }


  done()
  {
    this.router.navigate(['/home']);
  }
}
