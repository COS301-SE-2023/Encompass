import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import { CommunityApi, CommunityState } from '@encompass/app/community-profile/data-access';
import { CommunityDto } from '@encompass/api/community/data-access';
import { GetCommunity, GetCommunityPosts } from '@encompass/app/community-profile/util';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
import { UpdatePost } from '@encompass/app/home-page/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateCommunityRequest } from '@encompass/api/community/data-access';
import { UpdateCommunity } from '@encompass/app/community-profile/util';


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

  file!: File;
  fileBanner!: File;
  fileName!: string;
  fileNameBanner!: string;
  profile!: ProfileDto | null;
  community!: CommunityDto | null;
  communityPosts!: PostDto[] | null;
  likes: number[] =[] ;
   likedComments: boolean[] = [];
   shares : number[] = [];
   sharing: boolean[] = [];
   edit=false;
   members=0;
   hasImage=false;
   hasBanner=false;
  constructor(private store: Store, private router: Router, private route: ActivatedRoute,private formBuilder: FormBuilder, private communityApi: CommunityApi) {
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
        this.members = community.members.length;
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
    text: ['', Validators.maxLength(80)]
  });

  get text() {
    return this.postForm.get('text');
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

  Edit(){
    this.edit=true;
  }
  FinishEdit(){
    this.edit=false;
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

    if(this.community == null){
      return;
    }

    let textData : string;
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

    if(this.text?.value == null || this.text?.value == undefined){
      textData = "";
    }
    else{
      textData = this.text?.value;
    }

    const data : UpdateCommunityRequest = {
      name: this.community?.name,
      type: this.community?.type,
      admin: this.community?.admin,
      about: textData,
      rules: this.community?.rules,
      groupImage: imageUrl,
      bannerImage: bannerUrl,
      categories: this.community?.categories,
      events: this.community?.events,
      posts: this.community?.posts,
      members: this.community?.members,
      ageRestricted: this.community?.ageRestricted,
    }

    this.store.dispatch(new UpdateCommunity(this.community?._id, data));
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


  //***********************************UI FUNCTIONS**************************************************** */
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
