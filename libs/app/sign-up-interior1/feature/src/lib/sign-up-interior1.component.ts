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

  constructor(private router: Router, private store: Store){
    this.store.dispatch(new SubscribeToProfile())

    this.profile$.subscribe((profile) => {
      if(profile){
        console.log(profile);
        this.profile = profile;
      }
    });
  }
  
  buttonPressed(event: any){
    const name: string = (event.target as Element).id;

    if(this.categories.includes(name)){
      this.categories = this.categories.filter(obj => {return obj !== name});
    }

    else{
      this.categories.push(name);
    }
    
    // this.categories.push(event.target.srcElements.attributes.id);

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
      reviews: this.profile.reviews
    }

    this.store.dispatch(new UpdateProfile(data, this.profile.id))
    this.router.navigate(['sign-up-communities']);
  }
}
