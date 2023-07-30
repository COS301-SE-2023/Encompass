import { Component, Inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ModalController } from '@ionic/angular';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
import { UpdatePost } from '@encompass/app/home-page/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchState } from '@encompass/app/search-explore/data-access';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { GetUserSettings } from '@encompass/app/settings/util';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { takeUntil, pipe, Subject, take } from 'rxjs';
import { CommunityDto } from '@encompass/api/community/data-access';
import { SearchCommunities, SearchPosts, SearchProfiles } from '@encompass/app/search-explore/util';



@Component({
  selector: 'search-explore',
  templateUrl: './search-explore.component.html',
  styleUrls: ['./search-explore.component.scss']
})
export class SearchExploreComponent {


  requiredFileType = ['image/png', 'image/jpg', 'image/jpeg'];


  @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>

  @Select(SearchState.searchPosts) searchPosts$! : Observable<PostDto[] | null>;
  @Select(SearchState.searchProfiles) searchProfiles$! : Observable<ProfileDto[] | null>;
  @Select(SearchState.searchCommunities) searchCommunities$! : Observable<CommunityDto[] | null>;

  private unsubscribe$: Subject<void> = new Subject<void>();
  myCommunities! : CommunityDto[] | null;

  profile! : ProfileDto | null;
  posts : PostDto[] = [];
  communities! : CommunityDto[];
  profiles! : ProfileDto[];
  settings!: SettingsDto | null;
  datesAdded : string[] = [];
  comments  : number[] = [];
  shares : number[] = [];
   likes: number[] =[] ;
   likedComments: boolean[] = [];
   sharing: boolean[] = [];
   size=0;
   postsIsFetched = false
   communitiesIsFetched = false
   peopleIsFetched = false
   keyword = '';

   postReported : boolean[] = [];
   reports : boolean[] =[];


  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private store: Store, private modalController: ModalController
    ,private formBuilder: FormBuilder) {
    this.load();
   }


   async search(event: any) {
    this.keyword = event.detail.value;
    console.log("KEYWORD: " + this.keyword);

    if (!this.keyword) {
      // If the search keyword is empty, return
      return;
    }else {
      this.addPosts("posts", this.keyword);
      // this.addPosts("communities", keyword);
      // this.addPosts("people", keyword);
      // this.addPosts("events", keyword);
    }

   
  }


   load(){
    const page = document.getElementById('home-page');
  
      this.store.dispatch(new SubscribeToProfile())
      // this.store.dispatch(new SubscribeToProfile())
      this.profile$.subscribe((profile) => {
        if(profile){
          
          console.log("Profile CALLED")
          console.log(profile); 
          this.profile = profile;
          // this.addPosts("recommended");
          this.postChange();
  
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
                console.log("testing the feed page")
                console.log("hello " + this.settings.themes.themeImage);
                page.style.backgroundImage = `url(${this.settings.themes.themeImage})`;
              }else {
                console.log("page is null")
              }
            }
          })
          
        }
      });
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async addPosts(type: string, keyword: string){
    if(this.profile == null){
      return;
    }
  
      if (type === "posts") {
        this.store.dispatch(new SearchPosts(keyword));
      }else {
        return;
      }

      if(!this.postsIsFetched){
        
        this.postsIsFetched = true; 
        this.searchPosts$.pipe(takeUntil(this.unsubscribe$)).subscribe((posts) => {
        if(posts){
          // console.log("POSTS:")
          this.posts = [];
          const temp = posts;
          temp.forEach((post) => {
            
              this.posts.push(post);
            
          })
  
          // this.posts = posts;
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
  }

  async addCommunities(type: string, keyword: string){
    if(this.profile == null){
      return;
    }
  
      if (type === "communities") {
        this.store.dispatch(new SearchCommunities(keyword));
      }else {
        return;
      }

      if(!this.communitiesIsFetched){
        
        this.communitiesIsFetched = true; 
        this.searchCommunities$.pipe(takeUntil(this.unsubscribe$)).subscribe((communities) => {
        if(communities){
          // console.log("POSTS:")
          this.communities = [];
          const temp = communities;
          temp.forEach((community) => {
           
              this.communities.push(community);
            
          })
  
        }
      })
    }
  }

  async addPeople(type: string, keyword: string){
    if(this.profile == null){
      return;
    }
  
      if (type === "people") {
        this.store.dispatch(new SearchProfiles(keyword));
      }else {
        return;
      }

      if(!this.peopleIsFetched){
        
        this.peopleIsFetched = true; 
        this.searchProfiles$.pipe(takeUntil(this.unsubscribe$)).subscribe((profiles) => {
        if(profiles){
          // console.log("POSTS:")
          this.profiles = [];
          const temp = profiles;
          temp.forEach((person) => {
           
              this.profiles.push(person);
            
          })
  
        }
      })
    }
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

  Report(n:number){

  
    if(this.posts?.length==null){
      return;
    }
    const i = this.posts?.length-n-1;
  
    // console.log("n: " + n);
    // console.log("i: " + i);
  
    
    if(this.posts[i].reported==true){
      return;
    }
  
    if(this.reports[i]==true){
      for(let k = 0;k<this.reports.length;k++){
        this.reports[k]=false;
     }
    }
    else{
      for(let k = 0;k<this.reports.length;k++){
        this.reports[k]=false;
     }
     this.reports[i]=true;
    }
  
  }

  Like(n:number, post: PostDto){
    this.likedComments[n]=true;
    this.likes[n]++;
  
    let likesArr : string[];
  
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

  ReportPost(n:number, post: PostDto){
    // console.log("reporting post");
  
    if(this.posts?.length==null){
      return;
    }
    
    const i = this.posts?.length-n-1;
  
  
  for(let k = 0;k<this.postReported.length;k++){
        this.postReported[k]=false;
     }
     this.postReported[i]=true;  
  
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
  

  GoToCommunity(communityName:string){
    this.router.navigate(['home/community-profile/' + communityName]);
  }

  GoToProfile(username: string){
    this.router.navigate(['home/user-profile/' + username]);
  }

ViewPostofComment(postId: string){
    this.router.navigate(['home/app-comments-feature/' + postId]);
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
  
  postChange(){
    const PostBtn = document.getElementById('PostBtn');
    const CommentsBtn = document.getElementById('CommentsBtn');
    const eventBtn = document.getElementById('eventBtn');
    const PeopleBtn = document.getElementById('PeopleBtn');

    if (PostBtn && CommentsBtn && eventBtn && PeopleBtn) {
      PostBtn.classList.add('active-button');
      CommentsBtn.classList.remove('active-button');
      eventBtn.classList.remove('active-button');
      PeopleBtn.classList.remove('active-button');
    }
    
  }

  commChange(){
    const PostBtn = document.getElementById('PostBtn');
    const CommentsBtn = document.getElementById('CommentsBtn');
    const eventBtn = document.getElementById('eventBtn');
    const PeopleBtn = document.getElementById('PeopleBtn');

    if (PostBtn && CommentsBtn && eventBtn && PeopleBtn) {
      PostBtn.classList.remove('active-button');
      CommentsBtn.classList.add('active-button');
      eventBtn.classList.remove('active-button');
      PeopleBtn.classList.remove('active-button');
    }
  }

  eventChange(){
    const PostBtn = document.getElementById('PostBtn');
    const CommentsBtn = document.getElementById('CommentsBtn');
    const eventBtn = document.getElementById('eventBtn');
    const PeopleBtn = document.getElementById('PeopleBtn');

    if (PostBtn && CommentsBtn && eventBtn && PeopleBtn) {
      PostBtn.classList.remove('active-button');
      CommentsBtn.classList.remove('active-button');
      eventBtn.classList.add('active-button');
      PeopleBtn.classList.remove('active-button');
    }
  }

  peopleChange(){
    const PostBtn = document.getElementById('PostBtn');
    const CommentsBtn = document.getElementById('CommentsBtn');
    const eventBtn = document.getElementById('eventBtn');
    const PeopleBtn = document.getElementById('PeopleBtn');

    if (PostBtn && CommentsBtn && eventBtn && PeopleBtn) {
      PostBtn.classList.remove('active-button');
      CommentsBtn.classList.remove('active-button');
      eventBtn.classList.remove('active-button');
      PeopleBtn.classList.add('active-button');
    }
  }

  GoToComments(postId : string){
    this.router.navigate(['home/app-comments-feature/' + postId]);
  }


}
