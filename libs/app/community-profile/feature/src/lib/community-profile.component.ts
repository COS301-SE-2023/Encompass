import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCommunity, RemoveCommunity, SubscribeToProfile } from '@encompass/app/profile/util';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import { CommunityApi, CommunityState } from '@encompass/app/community-profile/data-access';
import { CommunityDto } from '@encompass/api/community/data-access';
import { AddCommunityRequest, GetCommunity, GetCommunityPosts, GetCommunityRequest, RemoveCommunityRequest } from '@encompass/app/community-profile/util';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
import { UpdatePost } from '@encompass/app/home-page/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateCommunityRequest } from '@encompass/api/community/data-access';
import { UpdateCommunity } from '@encompass/app/community-profile/util';
import { CommunityRequestDto } from '@encompass/api/community-request/data-access';
import { AddCommunity as AddOtherUserCommunity, RemoveCommunity as RemoveOtherUserCommunity } from '@encompass/app/community-profile/util';


@Component({
  selector: 'community-profile',
  templateUrl: './community-profile.component.html',
  styleUrls: ['./community-profile.component.scss']
})
export class CommunityProfileComponent {

  requiredFileType = ['image/png', 'image/jpg', 'image/jpeg'];

  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(CommunityState.community) community$!: Observable<CommunityDto | null>;
  @Select(CommunityState.posts) communityPosts$!: Observable<PostDto[] | null>;
  @Select(CommunityState.communityRequest) communityRequest$!: Observable<CommunityRequestDto | null>;

  file!: File;
  fileBanner!: File;
  fileName!: string;
  fileNameBanner!: string;
  profile!: ProfileDto | null;
  community!: CommunityDto | null;
  communityPosts!: PostDto[] | null;
  communityRequest!: CommunityRequestDto | null;
  
   shares : number[] = [];
   sharing: boolean[] = [];
   edit=false;
   members=0;
   hasImage=false;
   hasBanner=false;
   RemoveMember=false;

  myMembers: string[] = [];
  UpdatedMyMembers: string[] = [];
  removedMember: boolean[] = [];
  reports : boolean[] =[];
   posts! : PostDto[] | null;
   likes: number[] =[] ;
   likedComments: boolean[] = [];

  constructor(private store: Store, private router: Router, 
    private route: ActivatedRoute,private formBuilder: FormBuilder, private communityApi: CommunityApi) {
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
        this.myMembers = [];
        this.UpdatedMyMembers = [];
        this.community = community;
        console.log(community);
        this.members = community.members.length;
        for(let i =0; i<community.members.length;i++){
          if(community.members[i]!=this.profile?.username){
                this.myMembers.push(community.members[i]);
                this.removedMember.push(false);
          }
        }

        this.UpdatedMyMembers = this.myMembers;
        console.log("CONSTRUCTOR CALLED")
        console.log("My Members: " + this.myMembers);
        console.log("Updated My Members: " + this.UpdatedMyMembers);

        if(community.type !== "Public"){
          this.store.dispatch(new GetCommunityRequest(community._id))
          this.communityRequest$.subscribe((request) => {
            if(request){
              console.log(request);
              this.communityRequest = request;
            }
          })
        }
      }
    })

    this.store.dispatch(new GetCommunityPosts(communityName));
    this.communityPosts$.subscribe((posts) => {
      if(posts){
        this.communityPosts = posts;
        console.log(posts);

        for(let i =0;i<posts.length;i++){

          this.sharing.push(false);

          if(posts[i].dateAdded!=null&&posts[i].comments!=null
            &&posts[i].shares!=null){
              this.shares.push(posts[i].shares);
        }
      }

      }
    })

    
  }

  
  postForm = this.formBuilder.group({
    text: ['', Validators.maxLength(80)],
    rules: ['', Validators.maxLength(200)]
  });

  get text() {
    return this.postForm.get('text');
  }

  get rules(){
    return this.postForm.get('rules');
  }


  GoToComments(postId : string){
    this.router.navigate(['app-comments-feature/' + postId]);
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

  OpenRemove(){
    this.RemoveMember = !this.RemoveMember;
  }
  Edit(){
    this.edit=true;
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
    if(this.community == null){
      return;
    }

    let textData : string;
    let rulesData : string;
    let imageUrl : string | null;
    let bannerUrl : string | null;

    if(this.file){
      imageUrl = await this.uploadImage(this.file, this.fileName);

      if(imageUrl == null){
        imageUrl = this.community?.groupImage;
      }
    }

    else{
      imageUrl = this.community?.groupImage;
    }

    if(this.fileBanner){
      bannerUrl = await this.uploadImage(this.fileBanner, this.fileNameBanner);

      if(bannerUrl == null){
        bannerUrl = this.community?.bannerImage;
      }
    }

    else{
      bannerUrl = this.community?.bannerImage;
    }

    if(this.text?.value == null || this.text?.value == undefined||this.text?.value==""){
      textData = this.community?.about;
    }
    else{
      textData = this.text?.value;
    }

    if(this.rules?.value == null || this.rules?.value == undefined||this.rules?.value==""){
      rulesData = this.community?.rules;
    }
    else{
      rulesData = this.rules?.value;
    }

    const data : UpdateCommunityRequest = {
      name: this.community?.name,
      type: this.community?.type,
      admin: this.community?.admin,
      about: textData,
      rules: rulesData,
      groupImage: imageUrl,
      bannerImage: bannerUrl,
      categories: this.community?.categories,
      events: this.community?.events,
      posts: this.community?.posts,
      members: this.community?.members,
      ageRestricted: this.community?.ageRestricted,
    }

    this.store.dispatch(new UpdateCommunity(this.community?._id, data));
    this.postForm.reset();

  }

  async uploadImage(file: File, fileName: string) : Promise<string | null>{
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', file, fileName);

      const uploadFile = this.communityApi.uploadFile(formData)
      console.log(uploadFile);
      resolve(uploadFile);
    })
  }

  Remove(m: string,i:number){
    this.removedMember[i] = true;
    this.UpdatedMyMembers = this.UpdatedMyMembers.filter(x => x != m);
    console.log("REMOVE CALLED")
    console.log("My Members: " + this.myMembers);
    console.log("Updated My Members: " + this.UpdatedMyMembers);
  }

  Undo(m: string,i:number){
    this.removedMember[i] = false;
    this.UpdatedMyMembers.push(m);

    console.log("UNDO CALLED")
    console.log("My Members: " + this.myMembers);
    console.log("Updated My Members: " + this.UpdatedMyMembers);
  }

  CancelUpdate(){
    for(let i =0; i<this.removedMember.length;i++){
      this.removedMember[i] = false;
    }
    this.UpdatedMyMembers = this.myMembers;
    this.RemoveMember = false;

    console.log("CANCEL CALLED")
    console.log("My Members: " + this.myMembers);
    console.log("Updated My Members: " + this.UpdatedMyMembers);
  }
  UpdateCommunity(){
    this.RemoveMember = false;
    if(this.profile == null || this.community == null){
      return;
    }

    for(let i =0; i<this.removedMember.length;i++){
      this.removedMember[i] = false;
    }

    this.myMembers=this.UpdatedMyMembers;
    this.myMembers.push(this.profile?.username);
    console.log("UPDATE CALLED")
    console.log("My Members: " + this.myMembers);
    console.log("Updated My Members: " + this.UpdatedMyMembers);

    const data : UpdateCommunityRequest = {
      name: this.community?.name,
      type: this.community?.type,
      admin: this.community?.admin,
      about: this.community?.about,
      rules: this.community?.rules,
      groupImage: this.community?.groupImage,
      bannerImage: this.community?.bannerImage,
      categories: this.community?.categories,
      events: this.community?.events,
      posts: this.community?.posts,
      members: this.myMembers,
      ageRestricted: this.community?.ageRestricted,
    }

    this.store.dispatch(new UpdateCommunity(this.community?._id, data));

    const communityName = this.community?.name;

    this.myMembers.forEach(member => {
      this.store.dispatch(new RemoveOtherUserCommunity(communityName, member))
    })
    
    // To update the user that you removed call this.store.dispatch(new RemoveOtherUserCommunity(Community Name, Username of User to be removed))
  }
  join(){
    if(this.profile == null || this.community == null){
      return;
    }

    const newMembers : string[] = [...this.community.members, this.profile.username];

    const data : UpdateCommunityRequest = {
      name: this.community?.name,
      type: this.community?.type,
      admin: this.community?.admin,
      about: this.community?.about,
      rules: this.community?.rules,
      groupImage: this.community?.groupImage,
      bannerImage: this.community?.bannerImage,
      categories: this.community?.categories,
      events: this.community?.events,
      posts: this.community?.posts,
      members: newMembers,
      ageRestricted: this.community?.ageRestricted,
    }

    this.store.dispatch(new UpdateCommunity(this.community?._id, data));
    this.store.dispatch(new AddCommunity(this.community.name, this.profile.username))
  }

  leave(){
    if(this.profile == null || this.community == null){
      return;
    }
    const ourProfile: string = this.profile.username;

    const newMembers : string[] = this.community.members.filter(member => member != ourProfile);

    const data : UpdateCommunityRequest = {
      name: this.community?.name,
      type: this.community?.type,
      admin: this.community?.admin,
      about: this.community?.about,
      rules: this.community?.rules,
      groupImage: this.community?.groupImage,
      bannerImage: this.community?.bannerImage,
      categories: this.community?.categories,
      events: this.community?.events,
      posts: this.community?.posts,
      members: newMembers,
      ageRestricted: this.community?.ageRestricted,
    }

    this.store.dispatch(new UpdateCommunity(this.community?._id, data));
    this.store.dispatch(new RemoveCommunity(this.community.name, this.profile.username))
  }

  requestJoin(){
    if(this.profile == null || this.community == null){
      return;
    }

    this.store.dispatch(new AddCommunityRequest(this.community?._id, this.profile.username))
  }

  requestUnjoin(){
    if(this.profile == null || this.community == null){
      return;
    }

    this.store.dispatch(new RemoveCommunityRequest(this.community?._id, this.profile.username))
  }

  acceptUser(username: string){
    if(this.profile == null || this.community == null){
      return;
    }

    const newMembers : string[] = [...this.community.members, username];

    const data : UpdateCommunityRequest = {
      name: this.community?.name,
      type: this.community?.type,
      admin: this.community?.admin,
      about: this.community?.about,
      rules: this.community?.rules,
      groupImage: this.community?.groupImage,
      bannerImage: this.community?.bannerImage,
      categories: this.community?.categories,
      events: this.community?.events,
      posts: this.community?.posts,
      members: newMembers,
      ageRestricted: this.community?.ageRestricted,
    }

    this.store.dispatch(new UpdateCommunity(this.community?._id, data));
    this.store.dispatch(new RemoveCommunityRequest(this.community?._id, username))
    this.store.dispatch(new AddOtherUserCommunity(this.community.name, username))
  }

  rejectUser(username: string){
    if(this.profile == null || this.community == null){
      return;
    }

    this.store.dispatch(new RemoveCommunityRequest(this.community?._id, username))
  }
  //***********************************UI FUNCTIONS**************************************************** */
  recChange(){
    const recBtn = document.getElementById('recommendedBtn');
    const eventBtn = document.getElementById('eventBtn');


    if (recBtn && eventBtn) {
      recBtn.classList.add('active-button');
      eventBtn.classList.remove('active-button');

    }
  }

  eventChange(){
    const recBtn = document.getElementById('recommendedBtn');
    const eventBtn = document.getElementById('eventBtn');


    if (recBtn && eventBtn) {
      recBtn.classList.remove('active-button');
      eventBtn.classList.add('active-button');

    }
  }

  GoToProfile(username: string){
    if(this.profile?.username !== username){
      this.router.navigate(['home/user-profile/' + username]);
    }
  
    else{
      this.router.navigate(['home/profile']);
    }
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
}
