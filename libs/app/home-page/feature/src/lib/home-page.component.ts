import { Component } from '@angular/core';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { Select, Store } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { Observable } from 'rxjs';
import { HomeDto } from '@encompass/api/home/data-access';
import { Router } from '@angular/router';
import { getHome } from '@encompass/app/home-page/util';
import { Console } from 'console';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePage {
  @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;
  @Select(HomeState.home) home$! : Observable<HomeDto | null>;
  
  home! : HomeDto | null;
  profile! : ProfileDto | null;

  constructor(private router: Router, private store: Store){
    this.store.dispatch(new SubscribeToProfile())
    this.profile$.subscribe((profile) => {
      if(profile){
        console.log(profile);
        this.profile = profile;
      }
    });

    this.store.dispatch(new getHome());
    this.home$.subscribe((home) => {
      if(home){
      
        console.log(home.name);
      }
    });
  }

  GoToProfile()
  {
    this.router.navigate(['profile']);
  }

  UserProfile(){
    this.router.navigate(['user-profile']);
  }
}
