import { Component, Inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import {
  DislikeProfilePost,
  GetComments,
  GetPosts,
  LikeProfilePost,
  SubscribeToProfile,
  UpdatePost,
} from '@encompass/app/profile/util';
import { ModalController, ToastController } from '@ionic/angular';
import { CreatePostComponent } from '@encompass/app/create-post/feature';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
import { CommentDto } from '@encompass/api/comment/data-access';
import { DeletePost } from '@encompass/app/profile/util';
import { DeleteComment } from '@encompass/app/profile/util';
import { FormBuilder, Validators } from '@angular/forms';
import { UpdateProfileRequest } from '@encompass/api/profile/data-access';
import { UpdateProfile } from '@encompass/app/profile/util';
import { ProfileApi } from '@encompass/app/profile/data-access';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { GetUserSettings } from '@encompass/app/settings/util';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { PostsState } from '@encompass/app/posts/data-access';
import { GetByUsername } from '@encompass/app/event/util';
import { EventState } from '@encompass/app/event/data-access';
import { EventDto } from '@encompass/api/event/data-access';
// import { GetUserPosts, UpdateProfilePost } from '@encompass/app/posts/util';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfilePage {
  requiredFileType = ['image/png', 'image/jpg', 'image/jpeg'];

  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(ProfileState.posts) posts$!: Observable<PostDto[] | null>;
  @Select(ProfileState.comments) commentsList$!: Observable<
    CommentDto[] | null
  >;
  @Select(ProfileState.otherUsers) otherUsers$!: Observable<
    ProfileDto[] | null
  >;
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>;
  @Select(EventState.profileEvents) events$!: Observable<EventDto[] | null>;

  private unsubscribe$: Subject<void> = new Subject<void>();

  file!: File;
  fileBanner!: File;
  fileName!: string;
  fileNameBanner!: string;
  profile!: ProfileDto | null;
  events!: EventDto[] | null;
  otherUsers!: ProfileDto[] | null;
  posts!: PostDto[] | null;
  commentsList!: CommentDto[] | null;
  datesAdded: Date[] = [];
  comments: number[] = [];
  shares: number[] = [];
  likes: number[] = [];
  likedComments: boolean[] = [];
  sharing: boolean[] = [];
  seePosts = true;
  seeComments = false;
  seeEvents = false;
  viewreplies: boolean[] = [];
  replies: number[] = [];
  size = 0;
  edit = false;
  hasImage = false;
  hasBanner = false;
  settings!: SettingsDto | null;

  deletePost: boolean[] = [];
  deleteComment: boolean[] = [];
  MarkedForCommentDeletion: boolean[] = [];
  MarkedForPostDeletion: boolean[] = [];

  isPostsFetched = false;
  isProfileFetched = false;
  isCommentsFetched = false;
  isSettingsFetched = false;
  isProfileFetching = false;
  isEventsFetched = false;

  ViewCommunities = false;

  isModalOpen = false;
  isModal2Open = false;

  loading = true;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private store: Store,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private profileApi: ProfileApi,
    private profileState: ProfileState,
    private toastController: ToastController
  ) {
    // if (this.profile == null || this.profile == undefined) {
    //   console.log('Profile');
    //   return;
    // }
  }

  async ngOnInit() {
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));
    this.presentingElement = document.querySelector('.ion-page');
    this.presentingElement2 = document.querySelector('.ion-page');

    const page = document.getElementById('home-page');

    if (!this.isProfileFetched) {
      // this.isProfileFetched = true;
      this.store.dispatch(new SubscribeToProfile());
      this.profile$.pipe(takeUntil(this.unsubscribe$)).subscribe((profile) => {
        if (profile) {
          // console.log('Profile CALLED');
          // console.log(profile);
          this.profile = profile;
          // this.getPosts(profile);
          if (!this.isPostsFetched) {
            // this.isPostsFetched = true;
            // console.log('getPosts', profile);
            this.store.dispatch(new GetPosts(profile.username, profile._id));
            this.posts$.pipe(takeUntil(this.unsubscribe$)).subscribe((posts) => {
              if (posts) {
                // console.log('posts', posts);
                this.posts = posts;
                this.size = posts.length - 1;
                for (let i = 0; i < posts.length; i++) {
                  this.likedComments.push(false);
                  this.sharing.push(false);
                }

                for (let i = 0; i < posts.length; i++) {
                  this.deletePost.push(false);
                  this.MarkedForPostDeletion.push(false);
                  if (
                    posts[i].dateAdded != null &&
                    posts[i].comments != null &&
                    posts[i].shares != null
                  ) {
                    this.datesAdded.push(posts[i].dateAdded);
                    this.comments.push(posts[i].comments);
                    this.shares.push(posts[i].shares);
                  }

                  if (posts != null && posts[i].likes != null) {
                    this.likes.push(posts[i].likes?.length);
                    if (posts[i].likes?.includes(posts[i].username)) {
                      this.likedComments[i] = true;
                    }
                  }
                }

                this.loading = false;
              }
            });
          }
          // this.getComments(profile);
          // this.addPosts("recommended");
          // this.newChange();
          if (!this.isSettingsFetched) {
            this.isSettingsFetched = true;
            this.store.dispatch(new GetUserSettings(this.profile._id));

            this.settings$
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((settings) => {
                if (settings) {
                  this.settings = settings;

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
                    // console.log('testing the feed page');
                    // console.log('hello ' + this.settings.themes.themeImage);
                    page.style.backgroundImage = `url(${this.settings.themes.themeImage})`;
                  } else {
                    // console.log('page is null');
                  }
                }
              });
          }
        }
      });
    }
  }

  mobileview = false;

  updateMobileView() {
    this.mobileview = window.innerWidth <= 992;
  }


  postForm = this.formBuilder.group({
    FirstName: ['', Validators.maxLength(20)],
    LastName: ['', Validators.maxLength(20)],
    Bio: ['', Validators.maxLength(150)],
  });

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getPosts(profile: ProfileDto) {
    if (!this.isPostsFetched) {
      // this.isPostsFetched = true;
      // console.log('getPosts', profile);
      this.store.dispatch(new GetPosts(profile.username, profile._id));
      this.posts$.pipe(takeUntil(this.unsubscribe$)).subscribe((posts) => {
        if (posts) {
          // console.log('posts', posts);
          this.posts = posts;
          this.size = posts.length - 1;
          for (let i = 0; i < posts.length; i++) {
            this.likedComments.push(false);
            this.sharing.push(false);
          }

          for (let i = 0; i < posts.length; i++) {
            this.deletePost.push(false);
            this.MarkedForPostDeletion.push(false);
            if (
              posts[i].dateAdded != null &&
              posts[i].comments != null &&
              posts[i].shares != null
            ) {
              this.datesAdded.push(posts[i].dateAdded);
              this.comments.push(posts[i].comments);
              this.shares.push(posts[i].shares);
            }

            if (posts != null && posts[i].likes != null) {
              this.likes.push(posts[i].likes?.length);
              if (posts[i].likes?.includes(posts[i].username)) {
                this.likedComments[i] = true;
              }
            }
          }
        }
      });
    }

    // this.getComments(profile);
  }

  getComments(profile: ProfileDto) {
    // if(!this.isCommentsFetched){
    this.isCommentsFetched = true;
    this.store.dispatch(new GetComments(profile.username));
    this.commentsList$.subscribe((comments) => {
      if (comments) {
        // console.log(comments);
        this.commentsList = comments;

        for (let i = 0; i < comments.length; i++) {
          this.deleteComment.push(false);
          this.MarkedForCommentDeletion.push(false);
          this.viewreplies.push(false);
          if (comments[i].replies.length > 0) {
            this.replies[i] = comments[i].replies.length;
          } else {
            this.replies[i] = 0;
          }
        }
      }
    });
    // }
  }


  getEvents(profile: ProfileDto) {
    if(!this.isEventsFetched){
      this.isEventsFetched = true;

      this.store.dispatch(new GetByUsername(profile.username));
      this.events$.subscribe((events) => {
        if(events){
          // console.log(events);
          this.events = events;
        }
      })
    }
  }

  get FirstName() {
    return this.postForm.get('FirstName');
  }

  get LastName() {
    return this.postForm.get('LastName');
  }

  get Bio() {
    return this.postForm.get('Bio');
  }

  ViewPostofComment(postId: string) {
    this.router.navigate(['home/app-comments-feature/' + postId]);
  }

  async openPopup() {
    const modal = await this.modalController.create({
      component: CreatePostComponent,
      cssClass: 'custom-modal', // Replace with the component or template for your popup
      componentProps: {
        // Add any input properties or data you want to pass to the popup component
      },
    });

    return await modal.present();
  }

  GoToCommunity(communityName: string) {
    this.router.navigate(['home/community-profile/' + communityName]);
  }

  viewReplies(n: number) {
    for (let i = 0; i < this.viewreplies.length; i++) {
      if (i != n) {
        this.viewreplies[i] = false;
      }
    }
    this.viewreplies[n] = !this.viewreplies[n];
  }

  Edit() {
    this.edit = true;
  }

  Delete(n: number) {
    if (this.posts?.length == null) {
      return;
    }

    if (this.deletePost[n] == true) {
      for (let k = 0; k < this.deletePost.length; k++) {
        this.deletePost[k] = false;
      }
    } else {
      for (let k = 0; k < this.deletePost.length; k++) {
        this.deletePost[k] = false;
      }
      for(let k=0; k< this.MarkedForPostDeletion.length; k++){
        this.MarkedForPostDeletion[k]=false;
      }
      this.deletePost[n] = true;
    }

    this.MarkedForPostDeletion[n] = true;
  }

  Delete2(n: number) {
    if (this.comments?.length == null) {
      return;
    }

    if (this.deleteComment[n] == true) {
      for (let k = 0; k < this.deleteComment.length; k++) {
        this.deleteComment[k] = false;
      }
    } else {
      for (let k = 0; k < this.deleteComment.length; k++) {
        this.deleteComment[k] = false;
      }
      this.deleteComment[n] = true;
    }

    this.MarkedForCommentDeletion[n] = true;
  }

  DeletePost(n: number, post: PostDto) {
    this.MarkedForPostDeletion[n] = false;
    this.deletePost[n]=false;
    this.store.dispatch(new DeletePost(post._id));
  }

  DeleteComment(n: number, comment: CommentDto) {
    this.MarkedForCommentDeletion[n] = false;
    this.deleteComment[n]=false;
    this.store.dispatch(new DeleteComment(comment._id));
  }

  async Share(n: number, post: PostDto) {
    if (this.profile == null) {
      return;
    }
    this.shares[n]++;
    for (let i = 0; i < this.sharing.length; i++) {
      this.sharing[i] = false;
    }
    this.sharing[n] = true;

    const obj = location.origin;
    if (obj == undefined) {
      return;
    }

    const data: UpdatePostRequest = {
      title: post.title,
      text: post.text,
      imageUrl: post.imageUrl,
      communityImageUrl: post.communityImageUrl,
      categories: post.categories,
      likes: post.likes,
      dislikes: post.dislikes,
      spoiler: post.spoiler,
      ageRestricted: post.ageRestricted,
      shares: post.shares + 1,
      comments: post.comments,
      reported: post.reported,
    };

    this.store.dispatch(new UpdatePost(post._id, data));

    const link: string = obj + '/home/app-comments-feature/' + post._id;

    await navigator.clipboard.writeText(link);

    const toast = await this.toastController.create({
      message: 'Url Copied to Clipboard',
      duration: 2000,
      color: 'success',
    });

    await toast.present();
  }

  postChange() {

    this.seePosts = true;
    this.seeComments = false;
    this.seeEvents = false;

    if (this.profile === null) {
      return;
    }

    this.isPostsFetched = false;
    this.getPosts(this.profile);
  }

  async commChange() {
    if (this.profile === null) {
      return;
    }

    this.isCommentsFetched = false;
    await this.getComments(this.profile);


    this.seePosts = false;
    this.seeComments = true;
    this.seeEvents = false;
  }

  async eventChange() {
    if(this.profile === null){
      return;
    }

    this.isEventsFetched = false;
    await this.getEvents(this.profile);

    this.seePosts = false;
    this.seeComments = false;
    this.seeEvents = true;
  }

  GoToComments(postId: string) {
    this.router.navigate(['home/app-comments-feature/' + postId]);
  }

  presentingElement: any;
  presentingElement2: any;

  // ngOnInit() {
  //   this.presentingElement = document.querySelector('.ion-page');
  //   this.presentingElement2 = document.querySelector('.ion-page');
  // }

  FinishEdit() {
    this.edit = false;
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
    const file: File = event.target.files[0];

    if (file) {
      this.file = file;
      this.fileName = file.name;
    }
  }

  onFileBannerSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileBanner = file;
      this.fileNameBanner = file.name;
    }
  }

  async goToEvent(id: string){
    this.router.navigate(['home/challenge-description/' + id]);
  }

  daysLeft(targetDateStr: Date): number {
    const currentDate = new Date();
    const targetDate = new Date(targetDateStr);
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference >= 0 ? daysDifference : 0;
  }

  async onSubmit() {
    if (this.profile == null) {
      return;
    }

    let First: string;
    let Last: string;
    let bioData: string;

    let imageUrl: string | null;
    let bannerUrl: string | null;

    const toast = await this.toastController.create({
      message: 'Updating Profile',
      color: 'success'
    })

    toast.present();

    if (this.file) {
      imageUrl = await this.uploadImage(this.file, this.fileName);

      if (imageUrl == null) {
        imageUrl = this.profile?.profileImage;
      }
    } else {
      imageUrl = this.profile?.profileImage;
    }

    if (this.fileBanner) {
      bannerUrl = await this.uploadImage(this.fileBanner, this.fileNameBanner);

      if (bannerUrl == null) {
        bannerUrl = this.profile?.profileBanner;
      }
    } else {
      bannerUrl = this.profile?.profileBanner;
    }

    if (
      this.FirstName?.value == null ||
      this.FirstName?.value == undefined ||
      this.FirstName?.value == ''
    ) {
      First = this.profile?.name;
    } else {
      First = this.FirstName?.value;
    }

    if (
      this.LastName?.value == null ||
      this.LastName?.value == undefined ||
      this.LastName?.value == ''
    ) {
      Last = this.profile?.lastName;
    } else {
      Last = this.LastName?.value;
    }

    if (
      this.Bio?.value == null ||
      this.Bio?.value == undefined ||
      this.Bio?.value == ''
    ) {
      bioData = this.profile?.bio;
    } else {
      bioData = this.Bio?.value;
    }

    const data: UpdateProfileRequest = {
      username: this.profile?.username,
      name: First,
      lastName: Last,
      categories: this.profile?.categories,
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
    };

    this.store.dispatch(new UpdateProfile(data, this.profile?._id));
    toast.dismiss();

    const toast1 = await this.toastController.create({
      message: 'Profile successfully updated',
      duration: 2000,
      color: 'success'
    })

    await toast1.present();

    this.postForm.reset();
  }

  async uploadImage(file: File, fileName: string): Promise<string | null> {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', file, fileName);

      const uploadFile = this.profileApi.uploadFile(formData);
      // console.log(uploadFile);
      resolve(uploadFile);
    });
  }

  async loadFollowers() {
    this.otherUsers = [];
    if (this.profile == null) {
      return;
    }
    // console.log('here');
    // console.log(this.profile.followers);
    this.otherUsers = await this.profileState.getFollowers(
      this.profile.followers
    );

    // this.store.dispatch(new GetFollowers(this.profile.followers));
    // this.otherUsers$.subscribe((users) => {
    //   if(users){
    //     console.log(users);
    //     this.otherUsers = users;
    //   }
    // })
  }

  async loadFollowing() {
    this.otherUsers = [];

    if (this.profile == null) {
      return;
    }

    // console.log('here as well');
    // console.log(this.profile.following);
    this.otherUsers = await this.profileState.getFollowing(
      this.profile.following
    );

    // this.store.dispatch(new GetFollowing(this.profile.following));
    // this.otherUsers$.subscribe((users) => {
    //   if(users){
    //     this.otherUsers = users;
    //   }
    // })
  }

  async goToProfile(username: string | undefined) {
    // console.log('Route is ' + username);
    await this.modalController.dismiss();
    this.router.navigate(['home/user-profile/' + username]);
  }

  async shareProfile() {
    const obj = location.origin;
    if (obj == undefined) {
      return;
    }

    const link: string = obj + '/home/user-profile/' + this.profile?.username;

    await navigator.clipboard.writeText(link);

    const toast = await this.toastController.create({
      message: 'Url Copied to Clipboard',
      duration: 2000,
      color: 'success',
    });

    await toast.present();
  }

  Like(n: number, post: PostDto) {
    if (this.profile == null) {
      return;
    }

    this.store.dispatch(new LikeProfilePost(post._id, this.profile._id));
  }

  Dislike(n: number, post: PostDto) {
    if (this.profile == null) {
      return;
    }

    this.store.dispatch(new DislikeProfilePost(post._id, this.profile._id));
  }


  OpenView() {
    this.ViewCommunities = !this.ViewCommunities;
  }

  GoToProfile(username: string) {
    if (this.profile?.username !== username) {
      this.router.navigate(['home/user-profile/' + username]);
    } else {
      this.router.navigate(['home/profile']);
    }
  }

  setOpen(isOpen: boolean) {
    this.modalController.dismiss;
    this.isModalOpen = isOpen;
  }


  setOpen2(isOpen: boolean) {
    this.modalController.dismiss;
    this.isModal2Open = isOpen;
  }

}
