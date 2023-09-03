import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignUpModel, SignUpState } from '@encompass/app/sign-up/data-access';
import { Select, Store } from '@ngxs/store';
import { CreateAccountRequest } from '@encompass/api/account/data-access';
import { SignUp } from '@encompass/app/sign-up/util';
import { Observable } from 'rxjs';
import { AccountDto } from '@encompass/api/account/data-access';
@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpPage {
  @Select(SignUpState.signup) signup$!: Observable<AccountDto | null>;

  constructor(private router: Router, private store: Store) {}

  user: SignUpModel = new SignUpModel();

  isValid = false;
  checked = false;
  SignUp() {
    this.store.dispatch(
      new SignUp({
        email: this.user.email,
        password: this.user.password,
        username: this.user.username,
        name: this.user.firstName,
        lastName: this.user.lastName,
      })
    );
    this.signup$.subscribe((data) => {
      console.log(data);
      if (data !== null) {
        this.router.navigate(['sign-up-categories']);
      }
    });
  }

  Back() {
    this.router.navigate(['welcome']);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    return emailRegex.test(email);
  }

  checkInput() {
    if (
      this.user.email != '' &&
      this.user.password != '' &&
      this.user.username != '' &&
      this.user.firstName != '' &&
      this.user.lastName != '' &&
      this.checked == true &&
      this.user.password.length >= 8
    ) {
      if (this.isValidEmail(this.user.email)) {
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    } else {
      this.isValid = false;
    }
  }

  checkedTOS() {
    this.checked = !this.checked;

    if (
      this.user.email != '' &&
      this.user.password != '' &&
      this.user.username != '' &&
      this.user.firstName != '' &&
      this.user.lastName != '' &&
      this.checked == true &&
      this.user.password.length >= 8
    ) {
      if (this.isValidEmail(this.user.email)) {
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    } else {
      this.isValid = false;
    }
  }

  TOS() {
    this.router.navigate(['tscs']);
  }

  mobileview = false;

  ngOnInit() {
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));
  }

  updateMobileView() {
    this.mobileview = window.innerWidth <= 992;
  }
}
