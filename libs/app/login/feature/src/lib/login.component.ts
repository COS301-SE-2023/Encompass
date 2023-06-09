import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountDto } from '@encompass/api/account/data-access';
import { LoginStateModel, LoginState, LoginModel } from '@encompass/app/login/data-access';
import { login } from '@encompass/app/login/util';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginPage {
  user: LoginModel = new LoginModel();
  @Select(LoginState.loginModel) loginModel$!: Observable<AccountDto>;

  account!: AccountDto;

  constructor(
    private router: Router, private store: Store){}

    LogIn()
    {
      this.store.dispatch(new login({email: this.user.email, password: this.user.password}));
      this.loginModel$.subscribe((data) => {
        if(data){
          this.account = data;
          console.log(this.account._id);

          if(this.account._id != null || this.account._id != undefined){
            if(this.account._id != ""){
              // this.store.dispatch(new SubscribeToProfile())
              this.router.navigate(['home']);
            }
          }
        }
      });
    }

    Back(){
      this.router.navigate(['welcome']);
    }
}
