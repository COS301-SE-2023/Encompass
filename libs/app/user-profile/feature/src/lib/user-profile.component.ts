import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { UserProfileState } from '@encompass/app/user-profile/data-access';
import { GetUserProfile } from '@encompass/app/user-profile/util';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfile {
  @Select(UserProfileState.userProfile) userProfile$!: Observable<ProfileDto | null>
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null> 

  userProfile!: ProfileDto | null;
  profile!: ProfileDto | null;

  constructor(private store: Store, private router: Router, private route: ActivatedRoute){
    const username = this.route.snapshot.paramMap.get('username');

    if(username == null){
      return;
    }

    this.store.dispatch(new GetUserProfile(username))
    this.userProfile$.subscribe((userProfile) =>{
      if(userProfile){
        this.userProfile = userProfile
        console.log(this.userProfile)
      }
    })

    this.store.dispatch(new SubscribeToProfile())
    this.profile$.subscribe((profile) => {
      if(profile){
        this.profile = profile
        console.log(this.profile)
      }
    })
  }
}
