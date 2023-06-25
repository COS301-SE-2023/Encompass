import { Component } from '@angular/core';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { Select, Store } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { Observable } from 'rxjs';
import { HomeDto } from '@encompass/api/home/data-access';
import { Router } from '@angular/router';
import { GetAllPosts, getHome } from '@encompass/app/home-page/util';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ModalController } from '@ionic/angular';
import {CreatePostComponent} from '@encompass/app/create-post/feature';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
import {CreateCommunityComponent} from '@encompass/app/create-community/feature';
import { UpdatePost } from '@encompass/app/home-page/util';
import { APP_BASE_HREF } from '@angular/common';
@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedPage {

  @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;
  @Select(HomeState.homePosts) homePosts$! : Observable<PostDto[] | null>;

  profile! : ProfileDto;
  posts! : PostDto[] | null;
  reports : boolean[] =[];
  reportedPosts : boolean[]=[];
  datesAdded : string[] = [];
  comments  : number[] = [];
  shares : number[] = [];
   categoriesDisplay: string[][] = [];
   likes: number[] =[] ;
   likedComments: boolean[] = [];
   sharing: boolean[] = [];


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
        this.posts = posts;

        for(let i =0;i<posts.length;i++){
          this.likedComments.push(false);
          this.sharing.push(false);
        }

        for(let i =0;i<posts.length;i++){

              this.reports.push(false);
              this.reportedPosts.push(false);
              if(posts[i].dateAdded!=null&&posts[i].comments!=null
                &&posts[i].shares!=null){
                this.datesAdded.push(posts[i].dateAdded);
                  this.comments.push(posts[i].comments);
                  this.shares.push(posts[i].shares);
            }

            if(posts!=null&&posts[i].likes!=null){
                this.likes.push(posts[i].likes?.length);
                if(posts[i].likes?.includes(posts[i].username)){
                  this.likedComments[i]=true;
              }
            }

            if(posts[i].categories!=null){
              this.categoriesDisplay.push(posts[i].categories);
            }

          }

            for(let i = 0; i<posts.length;i++){
              for(let j =0;j<this.categoriesDisplay[i].length;j++){
                this.categoriesDisplay[i][j] = "assets/icon/"+this.categoriesDisplay[i][j]+".png";
              }
            }


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

Like(n:number, post: PostDto){
  this.likedComments[n]=true;
  this.likes[n]++;

  let likesArr;

  const emptyArray : string[] = [];

  if(post.likes == emptyArray){
    likesArr = [this.profile.username];
  }

  else{
    likesArr = [...post.likes, this.profile.username];
  }

  const data : UpdatePostRequest = {
    title: post.title,
    text: post.text,
    imageUrl: post.imageUrl,
    communityImageUrl: post.communityImageUrl,
    categories: post.categories,
    likes: likesArr,
    spoiler: post.spoiler,
    ageRestricted: post.ageRestricted,
    shares: post.shares,
    comments: post.comments,
    reported: post.reported
  }

  this.store.dispatch(new UpdatePost(post._id, data));
}

Dislike(n:number, post: PostDto){
  this.likedComments[n]=false;
  this.likes[n]--;

  let likesArr = [...post.likes];
  likesArr = likesArr.filter((like) => like !== this.profile.username);

  const data : UpdatePostRequest = {
    title: post.title,
    text: post.text,
    imageUrl: post.imageUrl,
    communityImageUrl: post.communityImageUrl,
    categories: post.categories,
    likes: likesArr,
    spoiler: post.spoiler,
    ageRestricted: post.ageRestricted,
    shares: post.shares,
    comments: post.comments,
    reported: post.reported
  }

  this.store.dispatch(new UpdatePost(post._id, data));
}

ReportPost(n:number, post: PostDto){
  console.log("reporting post");

  if(this.reportedPosts[n]==false){
    this.reportedPosts[n]=true;
  }

  const data : UpdatePostRequest = {
    title: post.title,
    text: post.text,
    imageUrl: post.imageUrl,
    communityImageUrl: post.communityImageUrl,
    categories: post.categories,
    likes: post.likes,
    spoiler: post.spoiler,
    ageRestricted: post.ageRestricted,
    shares: post.shares,
    comments: post.comments,
    reported: true
  }

  this.store.dispatch(new UpdatePost(post._id, data));
}

async Share(n:number, post: PostDto){
  this.shares[n]++;
  for(let i =0;i<this.sharing.length;i++){
    this.sharing[i]=false;
  }
  this.sharing[n]=true;

  const obj = location.origin
  if(obj == undefined){
    return;
  }

  const data : UpdatePostRequest = {
    title: post.title,
    text: post.text,
    imageUrl: post.imageUrl,
    communityImageUrl: post.communityImageUrl,
    categories: post.categories,
    likes: post.likes,
    spoiler: post.spoiler,
    ageRestricted: post.ageRestricted,
    shares: post.shares + 1,
    comments: post.comments,
    reported: post.reported
  }

  this.store.dispatch(new UpdatePost(post._id, data));

  const link : string = obj + '/app-comments-feature/' + post._id;

  await navigator.clipboard.writeText(link)
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
