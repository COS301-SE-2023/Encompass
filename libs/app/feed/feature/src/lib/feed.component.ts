import { Component } from '@angular/core';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { Select, Store } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { Observable } from 'rxjs';
import { HomeDto } from '@encompass/api/home/data-access';
import { Router } from '@angular/router';
import { GetAllPosts, getHome } from '@encompass/app/home-page/util';
import { Console } from 'console';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ModalController } from '@ionic/angular';
import {CreatePostComponent} from '@encompass/app/create-post/feature';
import { PostDto } from '@encompass/api/post/data-access';
import {CreateCommunityComponent} from '@encompass/app/create-community/feature';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedPage {

  @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;
  @Select(HomeState.homePosts) homePosts$! : Observable<PostDto[] | null>;
  
  profile! : ProfileDto | null;
  posts! : PostDto[] | null;
  reports : boolean[] =[];
  images : string[] = [];

  constructor(private router: Router, private store: Store, private modalController: ModalController){
    this.store.dispatch(new SubscribeToProfile())
    this.profile$.subscribe((profile) => {
      if(profile){
        console.log(profile);
        this.profile = profile;
      }
    });

    this.store.dispatch(new GetAllPosts());
    this.homePosts$.subscribe((posts) => {
      if(posts){
        console.log(posts);
        console.log(posts.length)
        this.posts = posts;
        for(let i =0;i<posts.length;i++){
              this.reports.push(false);
            } 
            console.log(this.reports);
      }
    })

}

async openPopup() {
  const modal = await this.modalController.create({
    component: CreatePostComponent,
    cssClass: 'custom-modal', // Replace with the component or template for your popup
    componentProps: {
      // Add any input properties or data you want to pass to the popup component
    }
  });

  return await modal.present();
}

async openPopup2() {
  const modal = await this.modalController.create({
    component: CreateCommunityComponent,
    cssClass: 'custom-modal', // Replace with the component or template for your popup
    componentProps: {
      // Add any input properties or data you want to pass to the popup component
    }
  });

  return await modal.present();
}

Report(n:number){
  if(this.reports[n]==true){
    this.reports[n]=false;
  }else if(this.reports[n]==false){
    this.reports[n]=true;
  }
 
}

  recChange(){
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');

    if (recBtn && newBtn && popBtn) {
      recBtn.classList.add('active-button');
      newBtn.classList.remove('active-button');
      popBtn.classList.remove('active-button');
    }
      
    
  }

  newChange(){
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');

    if (recBtn && newBtn && popBtn) {
      recBtn.classList.remove('active-button');
      newBtn.classList.add('active-button');
      popBtn.classList.remove('active-button');
    }
  }

  popChange(){
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');

    if (recBtn && newBtn && popBtn) {
      recBtn.classList.remove('active-button');
      newBtn.classList.remove('active-button');
      popBtn.classList.add('active-button');
    }
  }


  collapse1 = false;
  collapse2 = false;

  Collapse1(){
    this.collapse1 = !this.collapse1;
  }
  Collapse2(){
    this.collapse2 = !this.collapse2;
  }


}
