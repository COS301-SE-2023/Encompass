import { Component, Inject } from '@angular/core';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { Select, Store } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { Observable } from 'rxjs';
import { HomeDto } from '@encompass/api/home/data-access';
import { Router } from '@angular/router';
import { GetRecommendedCommunities,GetAllPosts, GetLatestPosts, GetPopularPosts, getHome, GetRecommendedBooks, GetRecommendedMovies } from '@encompass/app/home-page/util';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ModalController } from '@ionic/angular';
import {CreatePostComponent} from '@encompass/app/create-post/feature';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
import {CreateCommunityComponent} from '@encompass/app/create-community/feature';
import { UpdatePost } from '@encompass/app/home-page/util';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { GetUserSettings } from '@encompass/app/settings/util';
import { DatePipe } from '@angular/common';
import { CommunityDto } from '@encompass/api/community/data-access';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedPage {

  @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;
  @Select(HomeState.homePosts) homePosts$! : Observable<PostDto[] | null>;
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>
  @Select(HomeState.getCommunities) communities$! : Observable<CommunityDto[] | null>;

  settings!: SettingsDto | null;
  profile! : ProfileDto | null;
  posts! : PostDto[] | null;
  myCommunities! : CommunityDto[] | null;

  selectedCommunity: string | undefined;
  selectedCommunities : string[]=[];

  reports : boolean[] =[];
  postReported : boolean[] = [];

  datesAdded : string[] = [];
  comments  : number[] = [];
  shares : number[] = [];
  likes: number[] =[] ;
  likedComments: boolean[] = [];
  sharing: boolean[] = [];
  size=0;
  // type = "recommended";


  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private store: Store, private modalController: ModalController, private datePipe: DatePipe){
    const page = document.getElementById('home-page');

    this.store.dispatch(new SubscribeToProfile())
    // this.store.dispatch(new SubscribeToProfile())
    this.profile$.subscribe((profile) => {
      if(profile){
        
        console.log(profile); 
        this.profile = profile;
        // this.addPosts("recommended");
        this.recChange();

        this.store.dispatch(new GetUserSettings(this.profile._id))
        this.settings$.subscribe(settings => {
          if(settings){
            this.settings = settings;

            this.document.body.setAttribute('color-theme', this.settings.themes.themeColor);
            if (this.settings.themes.themeColor.startsWith('dark')) {
              const icons = document.getElementById('genreicons');

              if (icons) {
                icons.style.filter = 'invert(1)';
              }
            }

            if(page){
              page.style.backgroundImage = `url(${this.settings.themes.themeImage})`;
              // page.style.backgroundImage = "blue";
            }
          }
        })
        this.store.dispatch(new GetRecommendedCommunities(this.profile._id));

        this.communities$.subscribe((communities) => {
          if(communities){
            this.myCommunities = communities.slice(0, 3);
            console.log("COMMUNITIES: ");
            for(let k =0; k<this.myCommunities.length;k++){  
              console.log(this.myCommunities[k].name);
            }
            console.log("END OF COMMUNITIES: ")

          }
        })

       
        this.store.dispatch(new GetRecommendedBooks(this.profile._id));
        this.store.dispatch(new GetRecommendedMovies(this.profile._id));
      }
    });
}

async addPosts(type: string){
  if(this.profile == null){
    return;
  }

  if (type === "recommended") {
    this.store.dispatch(new GetAllPosts(this.profile?.username));
  } else if (type === "latest") {
    this.store.dispatch(new GetLatestPosts());
  } else {
    this.store.dispatch(new GetPopularPosts());
  }
  
  this.homePosts$.subscribe((posts) => {
    if(posts){
      this.posts = posts;
      this.size=posts.length-1;
      // console.log("SIZE: " + this.size)
      for(let i =0;i<posts.length;i++){
        this.likedComments.push(false);
        this.sharing.push(false);

        this.reports.push(false);
        this.postReported.push(false);

        if(posts[i].dateAdded!=null&&posts[i].comments!=null
          &&posts[i].shares!=null){
          this.datesAdded.push(posts[i].dateAdded);
          this.comments.push(posts[i].comments);
          this.shares.push(posts[i].shares);
        }

        if(posts!=null&&posts[i].likes!=null){
          this.likes.push(posts[i].likes?.length);
          

          if(this.profile==undefined){
            return;
          }
          if(posts[i].likes.includes(this.profile.username)){
            this.likedComments[i]=true;
          } 
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
  if(this.posts?.length==null){
    return;
  }
  
  if(this.reports[n]==true){
    this.reports[n]=false;
    return;
  }else{
    for(let k = 0;k<this.reports.length;k++){
      this.reports[k]=false;
   }   
    this.reports[n]=true;
    
  }

    

}

GoToCommunity(communityName:string){
  this.router.navigate(['home/community-profile/' + communityName]);
}

Like(n:number, post: PostDto){
 
  let likesArr : string[];

  console.log(this.profile?.username + " LIKED POST");
  const emptyArray : string[] = [];

  if(this.profile?.username == null){
    return;
  }
  
  if(post.likes == emptyArray){
    likesArr = [this.profile?.username];
  }

  else{
    likesArr = [...post.likes, this.profile?.username];
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
  likesArr = likesArr.filter((like) => like !== this.profile?.username);

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

  if(this.posts?.length==null){
    return;
  }
  
  this.reports[n]=false;  

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

GoToProfile(username: string){
  if(this.profile?.username !== username){
    this.router.navigate(['home/user-profile/' + username]);
  }

  else{
    this.router.navigate(['home/profile']);
  }
}

  recChange(){
    this.addPosts("recommended");
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
    this.addPosts("latest");
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
    this.addPosts("popular");
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');

    if (recBtn && newBtn && popBtn) {
      recBtn.classList.remove('active-button');
      newBtn.classList.remove('active-button');
      popBtn.classList.add('active-button');
    }
  }

  GoToComments(postId : string){
    this.router.navigate(['home/app-comments-feature/' + postId]);
  }

  collapse1 = false;
  collapse2 = false;

  Collapse1(){
    this.collapse1 = !this.collapse1;
  }
  Collapse2(){
    this.collapse2 = !this.collapse2;
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

}
