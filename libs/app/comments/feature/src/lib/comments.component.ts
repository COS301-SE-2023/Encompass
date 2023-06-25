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
  post!: PostDto;
  comment = false;
  reply = false;
  viewreply = false;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router){
    const postId = this.route.snapshot.paramMap.get('id');
    
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
      }
    })

    this.store.dispatch(new GetComments(postId));
    this.comments$.subscribe((comments) => {
      if(comments){
        console.log(comments);
        this.comments = comments;
      }
    })
  }


  AddComment(){
    this.comment = !this.comment;
  }

  Reply(){
    this.reply = !this.reply;
  }

  viewReplies(){
    this.viewreply = !this.viewreply;
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
