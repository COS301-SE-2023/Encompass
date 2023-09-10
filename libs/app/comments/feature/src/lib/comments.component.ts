import { Component, Inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  AddReplyRequest,
  CommentDto,
  CreateCommentRequest,
} from '@encompass/api/comment/data-access';
import { CommentsApi, CommentsState } from '@encompass/app/comments/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddComment,
  AddReply,
  GetComments,
  SendNotification,
} from '@encompass/app/comments/util';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AddNotificationRequest } from '@encompass/api/notifications/data-access';
import { ToastController } from '@ionic/angular';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { GetUserSettings } from '@encompass/app/settings/util';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { PostsState } from '@encompass/app/posts/data-access';
import { GetPost, UpdatePost } from '@encompass/app/posts/util';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent {
  @Select(CommentsState.comments) comments$!: Observable<CommentDto[] | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(PostsState.post) post$!: Observable<PostDto | null>;
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>;

  comments!: CommentDto[];
  profile!: ProfileDto;
  post!: PostDto | null;
  commentBool = false;
  reply: boolean[] = [];
  reports = false;
  reportedPosts = false;
  commentsnum = 0;
  shares = 0;
  likedComments = false;
  sharing = false;
  likes = 0;
  replies: number[] = [];
  viewreplies: boolean[] = [];
  inputValue!: string;
  inputValue2!: string;
  isValid = false;
  settings!: SettingsDto | null;
  isThemesCalled = false;
  show = true;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private commentState: CommentsState,
    private commentApi: CommentsApi
  ) {
    const postId = this.route.snapshot.paramMap.get('id');

    this.likes = 0;

    if (postId == null) {
      return;
    }

    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if (profile) {
        console.log(profile);
        this.profile = profile;

        this.store.dispatch(new GetUserSettings(profile._id));

        this.settings$.subscribe((settings) => {
          if (settings) {
            this.settings = settings;
          }
        });
      }
    });

    this.store.dispatch(new GetPost(postId));
    this.post$.subscribe((post) => {
      if (post) {
        console.log(post);
        if (post.isPrivate) {
          if (this.profile.communities.includes(post.community)) {
            this.post = post;
          } else {
            this.show = false;
            this.throwError();
          }
        } else {
          this.post = post;
        }
        // console.log("Categories: " + post.categories);
        this.likes = post.likes.length;
        if (post.likes.includes(this.profile.username)) {
          this.likedComments = true;
        }
      }
    });

    this.store.dispatch(new GetComments(postId));
    this.comments$.subscribe((comments) => {
      if (comments) {
        // console.log("Comments: ")
        // console.log(comments);
        this.comments = comments;
        for (let i = 0; i < comments.length; i++) {
          if (comments[i].replies.length > 0) {
            this.replies[i] = comments[i].replies.length;
          } else {
            this.replies[i] = 0;
          }
          this.reply.push(false);
          this.viewreplies.push(false);
        }
      }
    });

    this.setTheme();
  }

  commentForm = this.formBuilder.group({
    comment: ['', [Validators.required, Validators.maxLength(250)]],
  });

  replyForm = this.formBuilder.group({
    replyField: ['', [Validators.required, Validators.maxLength(250)]],
  });

  get comment() {
    return this.commentForm.get('comment');
  }

  get replyField() {
    return this.replyForm.get('replyField');
  }

  checkInput() {
    if (
      this.comment?.value == null ||
      this.comment?.value == undefined ||
      this.comment?.value == ''
    ) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }

  checkInput2() {
    if (
      this.replyField?.value == null ||
      this.replyField?.value == undefined ||
      this.replyField?.value == ''
    ) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }

  Report() {
    if (this.reports == true) {
      this.reports = false;
    } else if (this.reports == false) {
      this.reports = true;
    }
  }

  GoToCommunity(communityName: string) {
    this.router.navigate(['community-profile/' + communityName]);
  }

  ReportPost(post: PostDto) {
    if (this.reportedPosts == false) {
      this.reportedPosts = true;
    }

    const data: UpdatePostRequest = {
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
      reported: true,
    };

    this.store.dispatch(new UpdatePost(post._id, data));
  }

  CancelComment() {
    this.commentBool = !this.commentBool;
    for (let i = 0; i < this.reply.length; i++) {
      this.reply[i] = false;
    }

    this.commentForm.reset();
  }

  AddComment() {
    this.isValid = false;
    this.commentBool = !this.commentBool;
    if (this.comment?.value == null || this.comment?.value == undefined) {
      return;
    }

    if (this.post == undefined) {
      return;
    }

    if (this.profile == null) {
      return;
    }

    const data: CreateCommentRequest = {
      postId: this.post._id,
      username: this.profile.username,
      text: this.comment?.value,
      profileImage: this.profile.profileImage,
    };

    this.store.dispatch(new AddComment(data));
    this.commentApi.addCoins(this.post.username, 1);
    this.commentForm.reset();

    const postData: UpdatePostRequest = {
      title: this.post.title,
      text: this.post.text,
      imageUrl: this.post.imageUrl,
      communityImageUrl: this.post.communityImageUrl,
      categories: this.post.categories,
      likes: this.post.likes,
      spoiler: this.post.spoiler,
      ageRestricted: this.post.ageRestricted,
      shares: this.post.shares,
      comments: this.post.comments + 1,
      reported: this.post.reported,
    };

    this.store.dispatch(new UpdatePost(this.post._id, postData));
  }

  Reply(n: number) {
    this.commentBool = false;
    for (let i = 0; i < this.reply.length; i++) {
      if (i != n) {
        this.reply[i] = false;
      }
    }
    this.reply[n] = !this.reply[n];
  }

  CancelReply(n: number) {
    this.reply[n] = !this.reply[n];
    this.replyField?.reset();
  }

  PostReply(comment: CommentDto, n: number) {
    this.isValid = false;
    this.reply[n] = !this.reply[n];

    let reply;

    if (this.replyField?.value == null || this.replyField?.value == undefined) {
      reply = '';
    } else {
      reply = this.replyField?.value;
    }

    if (this.post == undefined) {
      return;
    }

    const data: AddReplyRequest = {
      username: this.profile.username,
      text: reply,
      profileImage: this.profile.profileImage,
    };

    this.store.dispatch(new AddReply(data, comment._id));
    this.replyField?.reset();

    const postData: UpdatePostRequest = {
      title: this.post.title,
      text: this.post.text,
      imageUrl: this.post.imageUrl,
      communityImageUrl: this.post.communityImageUrl,
      categories: this.post.categories,
      likes: this.post.likes,
      spoiler: this.post.spoiler,
      ageRestricted: this.post.ageRestricted,
      shares: this.post.shares,
      comments: this.post.comments + 1,
      reported: this.post.reported,
    };

    const notification: AddNotificationRequest = {
      sentBy: this.profile.name + ' ' + this.profile.lastName,
      picture: this.profile.profileImage,
      title: 'Replied to your comment',
      description: reply.substring(0, 20) + '...',
    };

    this.store.dispatch(new UpdatePost(this.post._id, postData));
    this.store.dispatch(new SendNotification(comment.username, notification));
  }

  viewReplies(n: number) {
    for (let i = 0; i < this.viewreplies.length; i++) {
      if (i != n) {
        this.viewreplies[i] = false;
      }
    }
    this.viewreplies[n] = !this.viewreplies[n];
  }

  // Like(){
  //   this.likedComments=true;
  //   this.likes++;
  // }

  // Dislike(){
  //   this.likedComments=false;
  //   this.likes--;
  // }
  setTheme() {
    const page = document.getElementById('home-page');

    if (this.settings == null) {
      return;
    }
    if (!this.isThemesCalled) {
      this.isThemesCalled = true;
      this.document.body.setAttribute(
        'color-theme',
        this.settings.themes.themeColor
      );
      if (this.settings.themes.themeColor.startsWith('dark')) {
        const icons = document.getElementById('genreicons');

        if (icons) {
          icons.style.filter = 'invert(1)';
        }
      }

      if (page) {
        console.log('testing the feed page');
        console.log('hello ' + this.settings.themes.themeImage);
        page.style.backgroundImage = `url(${this.settings.themes.themeImage})`;
      } else {
        console.log('page is null');
      }
    }
  }
  async throwError() {
    const toast = await this.toastController.create({
      message: 'You do not have access to this post',
      color: 'danger',
    });

    await toast.present();
  }

  mobileview = false;

  ngOnInit() {
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));
  }

  updateMobileView() {
    this.mobileview = window.innerWidth <= 992;
  }
}
