import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { SubscribeToProfile, UpdateProfile } from '@encompass/app/profile/util';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { Observable } from 'rxjs';
import { ProfileState } from '@encompass/app/profile/data-access';
import {
  SignUpCommunitiesApi,
  SignUpCommunitiesState,
} from '@encompass/app/sign-up-interior2/data-access';
import {
  CommunityDto,
  UpdateCommunityRequest,
} from '@encompass/api/community/data-access';
import { GetCommunities } from '@encompass/app/sign-up-interior2/util';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { UpdateProfileRequest } from '@encompass/api/profile/data-access';

@Component({
  selector: 'sign-up-interior2',
  templateUrl: './sign-up-interior2.component.html',
  styleUrls: ['./sign-up-interior2.component.scss'],
})
export class SignUpInterior2Component {
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(SignUpCommunitiesState.getCommunities) communities$!: Observable<
    CommunityDto[] | null
  >;

  profile!: ProfileDto | null;
  communities!: CommunityDto[] | null;
  myCommunities!: CommunityDto[] | null;
  selectedCommunities: string[] = [];
  selectedCommunity: string | undefined;
  constructor(
    private router: Router,
    private store: Store,
    private signupApi: SignUpCommunitiesApi
  ) {
    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if (profile) {
        this.profile = profile;

        this.store.dispatch(
          new GetCommunities(this.profile._id, this.profile.username)
        );
        this.communities$.subscribe((communities) => {
          console.log('communities:');
          if (communities) {
            console.log('communities:');
            console.log(communities);
            this.communities = communities;
            this.myCommunities = communities.slice(0, 3);
          }
        });
      } else {
        console.log('profile is null');
      }
    });
  }

  buttonStates: { [key: string]: boolean } = {}; // Object to track state for each button

  handleButtonClick(buttonId: string, CommunityName: string) {
    this.selectedCommunity = CommunityName;

    this.buttonStates[buttonId] = !this.buttonStates[buttonId];

    if (!this.selectedCommunities.includes(CommunityName)) {
      this.selectedCommunities.push(this.selectedCommunity);
    } else {
      this.selectedCommunities = this.selectedCommunities.filter(
        (community) => community !== this.selectedCommunity
      );
    }

    console.log(this.selectedCommunities);
  }

  done() {
    if (!this.profile) {
      return;
    }
    const data: UpdateProfileRequest = {
      username: this.profile.username,
      name: this.profile.name,
      lastName: this.profile.lastName,
      categories: this.profile.categories,
      communities: this.selectedCommunities,
      awards: this.profile.awards,
      events: this.profile.events,
      followers: this.profile.followers,
      following: this.profile.following,
      posts: this.profile.posts,
      reviews: this.profile.reviews,
      profileImage: this.profile.profileImage,
      profileBanner: this.profile.profileBanner,
      bio: this.profile.bio,
    };

    this.store.dispatch(new UpdateProfile(data, this.profile._id));

    if (this.profile) {
      this.selectedCommunities.forEach((community) => {
        this.communities?.forEach((comm) => {
          if (
            comm.name === community &&
            !comm.members.includes(this.profile!.username)
          ) {
            const newMembers = [...comm.members, this.profile!.username];
            const newEP = comm.communityEP + this.profile!.ep;

            const data2: UpdateCommunityRequest = {
              name: comm.name,
              type: comm.type,
              admin: comm.admin,
              about: comm.about,
              rules: comm.rules,
              groupImage: comm.groupImage,
              bannerImage: comm.bannerImage,
              categories: comm.categories,
              events: comm.events,
              posts: comm.posts,
              members: newMembers,
              ageRestricted: comm.ageRestricted,
              communityEP: newEP,
            };

            this.signupApi.updateCommunity(comm._id, data2);
          }
        });
      });
    }
    this.router.navigate(['/home']);
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
