import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostDto } from '@encompass/api/post/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { UserProfileState } from '@encompass/app/user-profile/data-access';
import { GetUserProfile, GetUserProfilePosts } from '@encompass/app/user-profile/util';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UpdatePostRequest } from '@encompass/api/post/data-access';
import { UpdatePost } from '@encompass/app/home-page/util';


@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfile {
  @Select(UserProfileState.userProfile) userProfile$!: Observable<ProfileDto | null>
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null> 
  @Select(UserProfileState.userProfilePosts) userPosts$!: Observable<PostDto[] | null>

  userProfile!: ProfileDto | null;
  profile!: ProfileDto | null;
  userPosts!: PostDto[] | null;
  seePosts=true;
   seeComments=false;
   shares : number[] = [];
   sharing: boolean[] = [];
   likes: number[] =[] ;
   likedComments: boolean[] = [];
   datesAdded : string[] = [];
   comments  : number[] = [];




  constructor(private store: Store, private router: Router, private route: ActivatedRoute){
    const username = this.route.snapshot.paramMap.get('username');

    if(username == null){
      return;
    }

    this.store.dispatch(new GetUserProfile(username))
    this.userProfile$.subscribe((userProfile) =>{
      if(userProfile){
        this.userProfile = userProfile
        console.log(this.userProfile)

        this.store.dispatch(new GetUserProfilePosts(this.userProfile.username))
        this.userPosts$.subscribe((userPosts) => {
          if(userPosts){
            this.userPosts = userPosts
            console.log(this.userPosts)
            for(let i =0;i<userPosts.length;i++){
              this.likedComments.push(false);
              this.sharing.push(false);

              if(userPosts[i].dateAdded!=null&&userPosts[i].comments!=null
                &&userPosts[i].shares!=null){
                this.datesAdded.push(userPosts[i].dateAdded);
                  this.comments.push(userPosts[i].comments);
                  this.shares.push(userPosts[i].shares);
            }

              if(userPosts!=null&&userPosts[i].likes!=null){
                this.likes.push(userPosts[i].likes?.length);
                if(userPosts[i].likes?.includes(userPosts[i].username)){
                  this.likedComments[i]=true;
              }
            }
            }
          }
        })
      }
    })

    this.store.dispatch(new SubscribeToProfile())
    this.profile$.subscribe((profile) => {
      if(profile){
        this.profile = profile
        console.log(this.profile)
      }
    })
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

    if (PostBtn && CommentsBtn && eventBtn) {
      PostBtn.classList.add('active-button');
      CommentsBtn.classList.remove('active-button');
      eventBtn.classList.remove('active-button');
    }

    this.seePosts=true;
   this.seeComments=false;
    
  }

  commChange(){
    const PostBtn = document.getElementById('PostBtn');
    const CommentsBtn = document.getElementById('CommentsBtn');
    const eventBtn = document.getElementById('eventBtn');

    if (PostBtn && CommentsBtn && eventBtn) {
      PostBtn.classList.remove('active-button');
      CommentsBtn.classList.add('active-button');
      eventBtn.classList.remove('active-button');
    }

    this.seePosts=false;
    this.seeComments=true;
  }

  eventChange(){
    const PostBtn = document.getElementById('PostBtn');
    const CommentsBtn = document.getElementById('CommentsBtn');
    const eventBtn = document.getElementById('eventBtn');

    if (PostBtn && CommentsBtn && eventBtn) {
      PostBtn.classList.remove('active-button');
      CommentsBtn.classList.remove('active-button');
      eventBtn.classList.add('active-button');
    }
  }

  GoToComments(postId : string){
    this.router.navigate(['app-comments-feature/' + postId]);
  }
  presentingElement: any;
  presentingElement2: any;

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.presentingElement2 = document.querySelector('.ion-page');
  }
  Follow(){
    
  }
}
