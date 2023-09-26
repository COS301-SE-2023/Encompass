import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountDto } from '@encompass/api/account/data-access';
import {
  LoginStateModel,
  LoginState,
  LoginModel,
} from '@encompass/app/login/data-access';
import { login } from '@encompass/app/login/util';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ToastController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @ViewChild('loginForm', { static: false })
  loginForm!: ElementRef<HTMLFormElement>;
  user: LoginModel = new LoginModel();
  @Select(LoginState.loginModel) loginModel$!: Observable<AccountDto>;

  account!: AccountDto;
  isValid = false;

  constructor(
    private router: Router,
    private store: Store,
    private toastController: ToastController
  ) {}

  async LogIn() {
    this.store.dispatch(
      new login({ email: this.user.email, password: this.user.password })
    );
    this.loginModel$.subscribe(async (data) => {
      if (data) {
        this.account = data;
        console.log(this.account._id);

        if (this.account._id != null || this.account._id != undefined) {
          if (this.account._id != '') {
            // this.store.dispatch(new SubscribeToProfile())
            this.router.navigate(['home']);
          }
        }
      }
    });
  }

  handleEnterKey(event: KeyboardEvent) {
    const loginbtn = document.getElementById('loginBtn');
    if (event.key === 'Enter') {
      if (loginbtn) {
        console.log('enter pressed');
        loginbtn.style.backgroundColor = 'var(--hover-color)';
      }
      const loginButton: HTMLButtonElement | null =
        this.loginForm.nativeElement.querySelector('.btn1');
      loginButton?.click();
    }
  }

  checkInput() {
    if (
      this.user.email != '' &&
      this.user.password != '' &&
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

  isValidEmail(email: string): boolean {
    // Regular expression to validate email addresses
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    // Test the email against the regex and return the result
    return emailRegex.test(email);
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
