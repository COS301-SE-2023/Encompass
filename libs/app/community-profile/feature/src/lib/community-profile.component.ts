import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import { CommunityState } from '@encompass/app/community-profile/data-access';
import { CommunityDto } from '@encompass/api/community/data-access';
import { GetCommunity, GetCommunityPosts } from '@encompass/app/community-profile/util';
import { PostDto } from '@encompass/api/post/data-access';


@Component({
  selector: 'community-profile',
  templateUrl: './community-profile.component.html',
  styleUrls: ['./community-profile.component.scss']
})
export class CommunityProfileComponent {

  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(CommunityState.community) community$!: Observable<CommunityDto | null>;
  @Select(CommunityState.posts) communityPosts$!: Observable<PostDto[] | null>;

  profile!: ProfileDto | null;
  community!: CommunityDto | null;
  communityPosts!: PostDto[] | null;

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
    const communityName = this.route.snapshot.paramMap.get('name');

    if(communityName == null){
      return;
    }

    this.store.dispatch(new SubscribeToProfile())
    this.profile$.subscribe((profile) => {
      if(profile){
        this.profile = profile;
      }
    })

    this.store.dispatch(new GetCommunity(communityName));
    this.community$.subscribe((community) => {
      if(community){
        this.community = community;
        console.log(community);
      }
    })

    this.store.dispatch(new GetCommunityPosts(communityName));
    this.communityPosts$.subscribe((posts) => {
      if(posts){
        this.communityPosts = posts;
        console.log(posts);
      }
    })
  }

  recChange(){
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');
    const eventBtn = document.getElementById('eventBtn');


    if (recBtn && newBtn && popBtn&&eventBtn) {
      recBtn.classList.add('active-button');
      newBtn.classList.remove('active-button');
      popBtn.classList.remove('active-button');
      eventBtn.classList.remove('active-button');

    }
  }

  newChange(){
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');
    const eventBtn = document.getElementById('eventBtn');


    if (recBtn && newBtn && popBtn&&eventBtn) {
      recBtn.classList.remove('active-button');
      newBtn.classList.add('active-button');
      popBtn.classList.remove('active-button');
      eventBtn.classList.remove('active-button');

    }
  }

  popChange(){
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');
    const eventBtn = document.getElementById('eventBtn');


    if (recBtn && newBtn && popBtn&&eventBtn) {
      recBtn.classList.remove('active-button');
      newBtn.classList.remove('active-button');
      popBtn.classList.add('active-button');
      eventBtn.classList.remove('active-button');

    }
  }

  eventChange(){
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');
    const eventBtn = document.getElementById('eventBtn');


    if (recBtn && newBtn && popBtn&&eventBtn) {
      recBtn.classList.remove('active-button');
      newBtn.classList.remove('active-button');
      popBtn.classList.remove('active-button');
      eventBtn.classList.add('active-button');

    }
  }
}
