import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CommentDto } from '@encompass/api/comment/data-access';
import { CommentsState } from '@encompass/app/comments/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ActivatedRoute, Router } from '@angular/router';
import { GetComments, GetPost } from '@encompass/app/comments/util';
import { PostDto } from '@encompass/api/post/data-access';
@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {
  @Select(CommentsState.comments) comments$!: Observable<CommentDto[] | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(CommentsState.post) post$!: Observable<PostDto | null>;

  comments!: CommentDto[];
  profile!: ProfileDto;
  post!: PostDto | null;
  comment = false;
  reply : boolean[] = [];
  reports = false;
  reportedPosts = false;
  commentsnum  = 0;
  shares = 0;
  likedComments = false;
  sharing = false;
  likes = 0;
  replies : number[] = [];
  viewreplies : boolean[] = [];


  constructor(private store: Store, private route: ActivatedRoute, private router: Router){
    const postId = this.route.snapshot.paramMap.get('id');
    
    this.likes=0;

    
    if(postId == null){
      return;
    }

    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if(profile){
        console.log(profile);
        this.profile = profile;
      }
    });

    this.store.dispatch(new GetPost(postId));
    this.post$.subscribe((post) => {
      if(post){
        console.log(post);
        this.post = post;
        console.log("Categories: " + post.categories);
        this.likes = post.likes.length;
        if(post.likes?.includes(post.username)){
          this.likedComments=true;
      }
      }
    })

    this.store.dispatch(new GetComments(postId));
    this.comments$.subscribe((comments) => {
      if(comments){
        console.log("Comments: ")
        console.log(comments);
        this.comments = comments;
        for(let i=0;i<comments.length;i++){
          if(comments[i].replies.length>0){
            this.replies[i]=comments[i].replies.length;
          }
          else{
            this.replies[i]=0;
          }
         this.reply.push(false);
         this.viewreplies.push(false);
        }
      }
    })
  }

  Report(){
    if(this.reports==true){
      this.reports=false;
    }else if(this.reports==false){
      this.reports=true;
    }
  }

  ReportPost(){
    console.log("reporting post");
  
    if(this.reportedPosts==false){
      this.reportedPosts=true;
    }
  }

  AddComment(){
    this.comment = !this.comment;
  }

  Cancel(n:number){
    this.reply[n] = !this.reply[n];

  }
  Reply(n:number){
    for(let i=0;i<this.reply.length;i++){
      if(i!=n){
        this.reply[i]=false;
      }
    }
    this.reply[n] = !this.reply[n];
    }

    CancelReply(n:number){
      this.reply[n] = !this.reply[n];
    }

    PostReply(n:number){

    }


  viewReplies(n:number){
for(let i=0;i<this.viewreplies.length;i++){
  if(i!=n){
    this.viewreplies[i]=false;
  }
}
    this.viewreplies[n] =!this.viewreplies[n];
    }

  goHome() {
    this.router.navigate(['/home']);
  }

  Share(id: string){
    this.shares++;
    this.sharing=true;

    // this.link += id;
    // if(this.posts[n]!=null){
    //   this.link += this.posts[n]?.imageUrl
  
    // }
  
  }
  Like(post:PostDto){
    this.likedComments=true;
    this.likes++;
  }

  Dislike(post:PostDto){
    this.likedComments=false;
    this.likes--;
  }
}

