import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { Observable } from 'rxjs';
import { ProfileState } from '@encompass/app/profile/data-access';
import { SignUpCommunitiesState } from '@encompass/app/sign-up-interior2/data-access';
import { CommunityDto } from '@encompass/api/community/data-access';
import { GetCommunities } from '@encompass/app/sign-up-interior2/util';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'sign-up-interior2',
  templateUrl: './sign-up-interior2.component.html',
  styleUrls: ['./sign-up-interior2.component.scss'],
  
})
export class SignUpInterior2Page{
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(SignUpCommunitiesState.getCommunities) communities$!: Observable<CommunityDto[] | null>;

  profile!: ProfileDto | null;
  communities!: CommunityDto[] | null;
  myCommunities! : CommunityDto[] | null;
  selectedCommunities : string[]=[];
  selectedCommunity: string | undefined;
  constructor(private router: Router, private store: Store){
    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if(profile){
        this.profile = profile;
        
        this.store.dispatch(new GetCommunities(this.profile._id));
        this.communities$.subscribe((communities) => {
          if(communities){
            console.log("communities:");
            console.log(communities);
            this.communities = communities;
            this.myCommunities = communities.slice(0, 3);
          }
        })
      }
    })
  }


    buttonStates: { [key: string]: boolean } = {}; // Object to track state for each button

    handleButtonClick(buttonId: string, CommunityName: string) {
      this.selectedCommunity = CommunityName;

      this.buttonStates[buttonId] = !this.buttonStates[buttonId];

      if(!this.selectedCommunities.includes(CommunityName))
      {

        this.selectedCommunities.push(this.selectedCommunity);

      }else{
        this.selectedCommunities=this.selectedCommunities.filter((community) => community !== this.selectedCommunity);

      }

      console.log(this.selectedCommunities);
    }


  

  done()
  {
    this.router.navigate(['/home']);
  }
}
