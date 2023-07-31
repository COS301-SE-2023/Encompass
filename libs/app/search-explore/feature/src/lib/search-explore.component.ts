import { Component, Inject } from '@angular/core';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { Select, Store } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { Observable } from 'rxjs';
import { HomeDto } from '@encompass/api/home/data-access';
import { Router } from '@angular/router';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { GetComments, GetPosts, SubscribeToProfile } from '@encompass/app/profile/util';
import { ModalController } from '@ionic/angular';
import {CreatePostComponent} from '@encompass/app/create-post/feature';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
import { UpdatePost } from '@encompass/app/home-page/util';
import { CommentDto } from '@encompass/api/comment/data-access';
import {DeletePost} from '@encompass/app/profile/util';
import {DeleteComment} from '@encompass/app/profile/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateProfileRequest } from '@encompass/api/profile/data-access';
import { UpdateProfile } from '@encompass/app/profile/util';
import { ProfileApi } from '@encompass/app/profile/data-access';
import { SearchState } from '@encompass/app/search-explore/data-access';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { GetUserSettings } from '@encompass/app/settings/util';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';



@Component({
  selector: 'search-explore',
  templateUrl: './search-explore.component.html',
  styleUrls: ['./search-explore.component.scss']
})
export class SearchExploreComponent {


  requiredFileType = ['image/png', 'image/jpg', 'image/jpeg'];


  @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;
  @Select(ProfileState.posts) posts$! : Observable<PostDto[] | null>;
  @Select(ProfileState.comments) commentsList$! : Observable<CommentDto[] | null>;
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>

  @Select(SearchState.searchPosts) searchPosts$! : Observable<PostDto[] | null>;
  @Select(SearchState.searchProfiles) searchProfiles$! : Observable<ProfileDto[] | null>;
  @Select(SearchState.searchCommunities) searchCommunities$! : Observable<ProfileDto[] | null>;


  file!: File;
  fileBanner!: File;
  fileName!: string;
  fileNameBanner!: string;
  profile! : ProfileDto | null;
  posts! : PostDto[] | null;
  commentsList!: CommentDto[] | null;
  settings!: SettingsDto | null;
  datesAdded : string[] = [];
  comments  : number[] = [];
  shares : number[] = [];
   likes: number[] =[] ;
   likedComments: boolean[] = [];
   sharing: boolean[] = [];
   seePosts=true;
   seeComments=false;
   viewreplies : boolean[] = [];
   replies : number[] = [];
   size=0;
   edit=false;
   hasImage=false;
   hasBanner=false;

   deletePost: boolean[] = [];
   deleteComment: boolean[] =[];
   MarkedForCommentDeletion: boolean[] = [];
   MarkedForPostDeletion: boolean[] = [];
   postReported : boolean[] = [];
   reports : boolean[] =[];


  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private store: Store, private modalController: ModalController
    ,private formBuilder: FormBuilder, private profileApi: ProfileApi) {
    this.store.dispatch(new SubscribeToProfile())
    this.profile$.subscribe((profile) => {
      if(profile){
        console.log(profile);
        this.profile = profile;

        this.store.dispatch(new GetPosts(profile.username));
        this.posts$.subscribe((posts) => {
          if(posts){
            this.posts = posts;
            this.size=posts.length-1;
            for(let i =0;i<posts.length;i++){
              this.likedComments.push(false);
              this.sharing.push(false);
            }

            for(let i =0;i<posts.length;i++){

                  this.deletePost.push(false);
                  this.MarkedForPostDeletion.push(false);
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

              }

              this.store.dispatch(new GetComments(profile.username));
              this.commentsList$.subscribe((comments) => {
                if(comments){
                  // console.log(comments);
                  this.commentsList = comments;
          
                  for(let i =0;i<comments.length;i++){
                    this.deleteComment.push(false);
                    this.MarkedForCommentDeletion.push(false);
                    this.viewreplies.push(false);
                    if(comments[i].replies.length>0){
                      this.replies[i]=comments[i].replies.length;
                    }
                    else{
                      this.replies[i]=0;
                    }
                  }
                }
              })
          }
        })
      }
    });

    this.load();
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
          this.newChange();
  
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

   postForm = this.formBuilder.group({
    FirstName: ['', Validators.maxLength(20)],
    LastName: ['', Validators.maxLength(20)],
    Bio: ['', Validators.maxLength(150)],

  });

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
  
 
  recChange(){
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');
    const eventBtn = document.getElementById('eventBtn');


    if (recBtn && newBtn && popBtn&&eventBtn) {
      recBtn.classList.add('active-button-filter');
      newBtn.classList.remove('active-button-filter');
      popBtn.classList.remove('active-button-filter');
      eventBtn.classList.remove('active-button-filter');

    }
  }

  GoToCommunity(communityName:string){
    this.router.navigate(['home/community-profile/' + communityName]);
  }

  GoToProfile(username: string){
    this.router.navigate(['home/user-profile/' + username]);
  }

  newChange(){
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');
    const eventBtn = document.getElementById('eventBtn');


    if (recBtn && newBtn && popBtn&&eventBtn) {
      recBtn.classList.remove('active-button-filter');
      newBtn.classList.add('active-button-filter');
      popBtn.classList.remove('active-button-filter');
      eventBtn.classList.remove('active-button-filter');

    }
  }



  popChange(){
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');
    const eventBtn = document.getElementById('eventBtn');


    if (recBtn && newBtn && popBtn&&eventBtn) {
      recBtn.classList.remove('active-button-filter');
      newBtn.classList.remove('active-button-filter');
      popBtn.classList.add('active-button-filter');
      eventBtn.classList.remove('active-button-filter');

    }
  }

  get FirstName(){
    return this.postForm.get('FirstName');
  }

  get LastName() {
    return this.postForm.get('LastName');
  }

  get Bio() {
    return this.postForm.get('Bio');
  }

ViewPostofComment(postId: string){
    this.router.navigate(['app-comments-feature/' + postId]);
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
  
viewReplies(n:number){
    for(let i=0;i<this.viewreplies.length;i++){
      if(i!=n){
        this.viewreplies[i]=false;
      }
    }
        this.viewreplies[n] =!this.viewreplies[n];
  }  
        
Edit(){
    this.edit=true;
  }
       
  Delete(n:number){

    if(this.posts?.length==null){
      return;
    }


    if(this.deletePost[n]==true){
      for(let k = 0;k<this.deletePost.length;k++){
        this.deletePost[k]=false;
     }
    }
    else{
      for(let k = 0;k<this.deletePost.length;k++){
        this.deletePost[k]=false;
     }
     this.deletePost[n]=true;
    }

    this.MarkedForPostDeletion[n]=true;
  }

  Delete2(n:number){

    if(this.comments?.length==null){
      return;
    }

    if(this.deleteComment[n]==true){
      for(let k = 0;k<this.deleteComment.length;k++){
        this.deleteComment[k]=false;
     }
    }else{
      for(let k = 0;k<this.deleteComment.length;k++){
        this.deleteComment[k]=false;
     }
     this.deleteComment[n]=true;
    }

   
     this.MarkedForCommentDeletion[n]=true;
    
      
    
  }

  DeletePost(n:number,post: PostDto){
    this.MarkedForPostDeletion[n]=false;
    this.store.dispatch(new DeletePost(post._id));
  }

  DeleteComment(n:number,comment: CommentDto){
    this.MarkedForCommentDeletion[n]=false;
    this.store.dispatch(new DeleteComment(comment._id));
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

    this.seePosts=true;
   this.seeComments=false;
    
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

    this.seePosts=false;
    this.seeComments=true;
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

  presentingElement: any;
  presentingElement2: any;

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.presentingElement2 = document.querySelector('.ion-page');
  }

  FinishEdit(){

    this.edit=false;
    this.hasImage = false;
    this.hasBanner = false;

  }

  insertImage() {
    this.hasImage = !this.hasImage;
  }

  insertBanner() {
    this.hasBanner = !this.hasBanner;
  }

  onFileSelected(event: any) {

    const file:File = event.target.files[0];

    if (file) {
        this.file = file;
        this.fileName = file.name;
    }
  }

  onFileBannerSelected(event: any) {

    const file:File = event.target.files[0];

    if (file) {
        this.fileBanner = file;
        this.fileNameBanner = file.name;
    }
  }

  async onSubmit(){

    console.log("OH HELLO THERE!!!!!!");
    if(this.profile == null){
      return;
    }

    let textData : string;

    let First : string;
    let Last : string;
    let bioData : string;

    let imageUrl : string | null;
    let bannerUrl : string | null;

    if(this.file){
      imageUrl = await this.uploadImage(this.file, this.fileName);

      if(imageUrl == null){
        imageUrl = this.profile?.profileImage;
      }
    }

    else{
      imageUrl = this.profile?.profileImage;
    }

    if(this.fileBanner){
      bannerUrl = await this.uploadImage(this.fileBanner, this.fileNameBanner);

      if(bannerUrl == null){
        bannerUrl = this.profile?.profileBanner;
      }
    }

    else{
      bannerUrl = this.profile?.profileBanner;
    }

    if(this.FirstName?.value == null || this.FirstName?.value == undefined){
      First = "";
    }
    else{
      First = this.FirstName?.value;
    }

    if(this.LastName?.value == null || this.LastName?.value == undefined){
      Last = "";
    }
    else{
      Last = this.LastName?.value;
    }

    if(this.Bio?.value == null || this.Bio?.value == undefined){
      bioData = "";
    }
    else{
      bioData = this.Bio?.value;
    }

    const data : UpdateProfileRequest = {
  username: this.profile?.username,
  name: First,
  lastName: Last,
  categories:  this.profile?.categories,
  communities: this.profile?.communities,
  awards: this.profile?.awards,
  events: this.profile?.events,
  followers: this.profile?.followers,
  following: this.profile?.following,
  posts: this.profile?.posts,
  reviews: this.profile?.reviews,
  profileImage: imageUrl,
  profileBanner: bannerUrl,
  bio: bioData,

    }

    this.store.dispatch(new UpdateProfile(data,this.profile?._id));
  }

  async uploadImage(file: File, fileName: string) : Promise<string | null>{
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', file, fileName);

      const uploadFile = this.profileApi.uploadFile(formData)
      console.log(uploadFile);
      resolve(uploadFile);
    })
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
