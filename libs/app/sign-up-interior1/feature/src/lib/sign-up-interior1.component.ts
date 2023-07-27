import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { ProfileState } from '@encompass/app/profile/data-access';
import { Observable } from 'rxjs';
import { ProfileDto, UpdateProfileRequest } from '@encompass/api/profile/data-access';
import { SubscribeToProfile, UpdateProfile } from '@encompass/app/profile/util';

@Component({
  selector: 'sign-up-interior1',
  templateUrl: './sign-up-interior1.component.html',
  styleUrls: ['./sign-up-interior1.component.scss']
})
export class SignUpInterior1Page {
  @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;

  profile! : ProfileDto | null;
  categories : string[] = [];
  isValid = false;
  selectedButtonId: string | undefined;

  constructor(private router: Router, private store: Store){
    this.store.dispatch(new SubscribeToProfile())

    this.profile$.subscribe((profile) => {
      if(profile){
        console.log(profile);
        this.profile = profile;
      }
    });
  }
  
  buttonPressed(buttonId: string){
    this.selectedButtonId = buttonId;

    if(!this.categories.includes(buttonId)){
      this.categories.push(this.selectedButtonId);
      const activate = document.getElementById(this.selectedButtonId);
      if (activate) {
      activate.classList.add('topic-active');
      }
    }else{
      this.categories = this.categories.filter((category) => category !== this.selectedButtonId);
      const activate = document.getElementById(this.selectedButtonId);
      if (activate) {
      activate.classList.remove('topic-active');
      }
    }
    
    if(this.categories.length >= 5){
      this.isValid=true;
    }else{
      this.isValid=false;
    }
    console.log(this.categories)

  }

  next(){
    if(!this.profile){
      return;
    }

    const data : UpdateProfileRequest = {
      username: this.profile.username,
      name: this.profile.name,
      lastName: this.profile.lastName,
      categories: this.categories,
      communities: this.profile.communities,
      awards: this.profile.awards,
      events: this.profile.events,
      followers: this.profile.followers,
      following: this.profile.following,
      posts: this.profile.posts,
      reviews: this.profile.reviews,
      profileImage: this.profile.profileImage,
      profileBanner: this.profile.profileBanner,
      bio: this.profile.bio,
    }

    this.store.dispatch(new UpdateProfile(data, this.profile._id))
    this.router.navigate(['sign-up-communities']);
  }
}
