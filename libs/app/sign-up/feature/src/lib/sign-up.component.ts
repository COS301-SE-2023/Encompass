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
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpPage {
  @Select(SignUpState.signup) signup$!: Observable<AccountDto | null>;

  constructor(private router: Router, private store: Store){
  }

    user : SignUpModel = new SignUpModel();

    isValid()
    {
      if(this.user.email != null && this.user.password != null && this.user.name != null)
      {
        return true
      }

      else
        return false;
    }

    SignUp()
    {
      this.store.dispatch(new SignUp({email: this.user.email, password: this.user.password, username: this.user.name}));
      this.signup$.subscribe((data) => {
        console.log(data);
        if(data?._id != null)
        {
           this.router.navigate(['sign-up-categories']);
        }
      });
    }

    Back(){
      this.router.navigate(['welcome']);
    }
}
