import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddReplyRequest, CommentDto, CreateCommentRequest } from '@encompass/api/comment/data-access';
import { CommentsState } from '@encompass/app/comments/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ActivatedRoute, Router } from '@angular/router';
import { AddComment, AddReply, GetComments, GetPost, UpdatePost } from '@encompass/app/comments/util';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
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
  commentBool = false;
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
  inputValue!: string;
  inputValue2!: string;
  isValid = false;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder){
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

  commentForm = this.formBuilder.group({
    comment: ['', [ Validators.required, Validators.maxLength(250)]],
  });

  replyForm = this.formBuilder.group({
    replyField: ['', [ Validators.required, Validators.maxLength(250)]],
  })

  get comment(){
    return this.commentForm.get('comment');
  }

  get replyField(){
    return this.replyForm.get('replyField');
  }

  checkInput(){

    if(this.comment?.value == null || this.comment?.value == undefined 
        || this.comment?.value =="" ){

      this.isValid = false;
         
    }else{
      this.isValid = true;
    }
    console.log("HELLO");

    console.log(this.isValid);
    
  }

  checkInput2(){

    if(this.replyField?.value == null || this.replyField?.value == undefined 
        || this.replyField?.value =="" ){

      this.isValid = false;
         
    }else{
      this.isValid = true;
    }
    console.log("HELLO");

    console.log(this.isValid);
    
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

  CancelComment(){
    this.commentBool = !this.commentBool;
for(let i=0;i<this.reply.length;i++){
  this.reply[i]=false;
}
  }

  

  AddComment(){

    this.isValid=false;
    this.commentBool = !this.commentBool;
    if(this.comment?.value == null || this.comment?.value == undefined){
      return;
    }

    if(this.post == undefined){
      return;
    }

    if(this.profile == null){
      return;
    }

    const data: CreateCommentRequest ={
      postId: this.post._id,
      username: this.profile.username,
      text: this.comment?.value
    }

    this.store.dispatch(new AddComment(data));
    this.commentForm.reset();

    const postData: UpdatePostRequest ={
      title: this.post.title,
      text: this.post.text,
      imageUrl: this.post.imageUrl,
      communityImageUrl: this.post.communityImageUrl,
      categories: this.post.categories,
      likes: this.post.likes,
      spoiler: this.post.spoiler,
      ageRestricted: this.post.ageRestricted,
      shares: this.post.shares,
      comments: this.post.comments+1,
      reported: this.post.reported,
    }
    
    this.store.dispatch(new UpdatePost(this.post._id, postData));
  }

  Reply(n:number){

    this.commentBool = false;
    for(let i=0;i<this.reply.length;i++){
      if(i!=n){
        this.reply[i]=false;
      }
    }
    this.reply[n] = !this.reply[n];
    }

    CancelReply(n:number){
      this.reply[n] = !this.reply[n];
      this.replyField?.reset();
    }

    PostReply(comment: CommentDto,n:number){

      this.isValid = false;
      this.reply[n] = !this.reply[n];

      let reply;

      if(this.replyField?.value == null || this.replyField?.value == undefined){
        reply = "";
      }

      else{
        reply = this.replyField?.value;
      }

      if(this.post == undefined){
        return;
      }
      
      const data: AddReplyRequest ={
        username: this.profile.username,
        text: reply
      }

      this.store.dispatch(new AddReply(data, comment._id));
      this.replyField?.reset();

      const postData: UpdatePostRequest ={
        title: this.post.title,
        text: this.post.text,
        imageUrl: this.post.imageUrl,
        communityImageUrl: this.post.communityImageUrl,
        categories: this.post.categories,
        likes: this.post.likes,
        spoiler: this.post.spoiler,
        ageRestricted: this.post.ageRestricted,
        shares: this.post.shares,
        comments: this.post.comments+1,
        reported: this.post.reported,
      }
      
      this.store.dispatch(new UpdatePost(this.post._id, postData));
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

  
  Like(post:PostDto){
    this.likedComments=true;
    this.likes++;
  }

  Dislike(post:PostDto){
    this.likedComments=false;
    this.likes--;
  }
}

