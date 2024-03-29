import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddCommunity,
  RemoveCommunity,
  SubscribeToProfile,
} from '@encompass/app/profile/util';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import {
  CommunityApi,
  CommunityState,
} from '@encompass/app/community-profile/data-access';
import { CommunityDto } from '@encompass/api/community/data-access';
import {
  AddCommunityRequest,
  DislikeCommunityPostArray,
  GetCommunity,
  GetCommunityPosts,
  GetCommunityRequest,
  GetRanking,
  LikeCommunityPostArray,
  RemoveCommunityRequest,
  UpdatePostArray,
} from '@encompass/app/community-profile/util';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
// import { UpdatePost } from '@encompass/app/home-page/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateCommunityRequest } from '@encompass/api/community/data-access';
import { UpdateCommunity } from '@encompass/app/community-profile/util';
import { CommunityRequestDto } from '@encompass/api/community-request/data-access';
import {
  AddOtherUserCommunity,
  RemoveOtherUserCommunity,
} from '@encompass/app/community-profile/util';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { GetUserSettings } from '@encompass/app/settings/util';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { CommunityLeaderboardDto } from '@encompass/api/community-leaderboard/data-access';
import { EventState } from '@encompass/app/event/data-access';
import { EventDto } from '@encompass/api/event/data-access';
import { GetByCommunity } from '@encompass/app/event/util';
// import { PostsState } from '@encompass/app/posts/data-access';
// import { GetCommunityPosts, UpdatePostArray } from '@encompass/app/posts/util';

@Component({
  selector: 'community-profile',
  templateUrl: './community-profile.component.html',
  styleUrls: ['./community-profile.component.scss'],
})
export class CommunityProfileComponent {
  requiredFileType = ['image/png', 'image/jpg', 'image/jpeg'];

  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(CommunityState.community)
  community$!: Observable<CommunityDto | null>;
  @Select(CommunityState.posts) communityPosts$!: Observable<PostDto[] | null>;
  @Select(CommunityState.communityRequest)
  communityRequest$!: Observable<CommunityRequestDto | null>;
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>;
  @Select(CommunityState.leaderboard) communityLeaderboard$!: Observable<
    CommunityLeaderboardDto[] | null
  >;
  @Select(EventState.communityEvents) events$!: Observable<EventDto[] | null>;

  file!: File;
  fileBanner!: File;
  fileName!: string;
  fileNameBanner!: string;
  profile!: ProfileDto | null;
  community!: CommunityDto | null;
  communityPosts!: PostDto[] | null;
  events!: EventDto[] | null;
  communityLeaderboard!: CommunityLeaderboardDto[] | null;
  communityRequest!: CommunityRequestDto | null;

  shares: number[] = [];
  sharing: boolean[] = [];
  edit = false;
  members = 0;
  hasImage = false;
  hasBanner = false;
  RemoveMember = false;
  settings!: SettingsDto | null;
  themeName!: string;

  myMembers: string[] = [];
  UpdatedMyMembers: string[] = [];
  removedMember: boolean[] = [];
  removedlist: string[] = [];
  reports: boolean[] = [];
  posts!: PostDto[] | null;
  likes: number[] = [];
  likedComments: boolean[] = [];

  isSettingsFetched = false;
  isCommunityRequestFetched = false;
  position!: number;
  showPosts = true;
  showEvents = false;
  loading = true;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private communityApi: CommunityApi,
    private toastController: ToastController
  ) {
    const page = document.getElementById('home-page');
    const communityName = this.route.snapshot.paramMap.get('name');

    if (communityName == null) {
      return;
    }

    this.store.dispatch(new GetCommunity(communityName));
    this.community$.subscribe((community) => {
      if (community) {
        this.myMembers = [];
        this.UpdatedMyMembers = [];
        this.community = community;
        // console.log(community);
        this.members = community.members.length;
        for (let i = 0; i < community.members.length; i++) {
          if (
            community.members[i] == this.profile?.username &&
            community.admin == this.profile?.username
          ) {
            continue;
          }
          this.myMembers.push(community.members[i]);
          this.removedMember.push(false);
        }

        this.UpdatedMyMembers = this.myMembers;
        // console.log('CONSTRUCTOR CALLED');
        // console.log('My Members: ' + this.myMembers);
        // console.log('Updated My Members: ' + this.UpdatedMyMembers);

        if (community.type !== 'Public') {
          if (!this.isCommunityRequestFetched) {
            this.isCommunityRequestFetched = true;
            this.store.dispatch(new GetCommunityRequest(community._id));
            this.communityRequest$.subscribe((request) => {
              if (request) {
                // console.log(request);
                this.communityRequest = request;
              }
            });
          }
        }
      }
    });

    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if (profile) {
        this.profile = profile;

        if (!this.isSettingsFetched) {
          this.store.dispatch(new GetUserSettings(this.profile._id));
          this.settings$.subscribe((settings) => {
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
    
              this.themeName = this.settings.themes.themeColor;
    
              // console.log(this.themeName);
    
              const defaultcloud = document.getElementById('cloud-default');
              const redcloud = document.getElementById('cloud-red');
              const bluecloud = document.getElementById('cloud-blue');
              const greencloud = document.getElementById('cloud-green');
              const orangecloud = document.getElementById('cloud-orange');
    
              if (
                defaultcloud &&
                redcloud &&
                bluecloud &&
                greencloud &&
                orangecloud
              ) {
                // console.log('default cloudsssssssssssssssssssssssssssssssss1');
                // console.log(this.themeName);
                if (this.themeName == 'light-red' || this.themeName == 'dark-red') {
                  redcloud.classList.remove('visible');
                  defaultcloud.classList.add('visible');
                  bluecloud.classList.add('visible');
                  greencloud.classList.add('visible');
                  orangecloud.classList.add('visible');
                } else if (
                  this.themeName == 'light-blue' ||
                  this.themeName == 'dark-blue'
                ) {
                  // console.log('BLUEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
                  bluecloud.classList.remove('visible');
                  defaultcloud.classList.add('visible');
                  redcloud.classList.add('visible');
                  greencloud.classList.add('visible');
                  orangecloud.classList.add('visible');
                } else if (
                  this.themeName == 'light-green' ||
                  this.themeName == 'dark-green'
                ) {
                  greencloud.classList.remove('visible');
                  defaultcloud.classList.add('visible');
                  redcloud.classList.add('visible');
                  bluecloud.classList.add('visible');
                  orangecloud.classList.add('visible');
                } else if (
                  this.themeName == 'light-orange' ||
                  this.themeName == 'dark-orange'
                ) {
                  orangecloud.classList.remove('visible');
                  defaultcloud.classList.add('visible');
                  redcloud.classList.add('visible');
                  bluecloud.classList.add('visible');
                  greencloud.classList.add('visible');
                } else {
                  defaultcloud.classList.remove('visible');
                  redcloud.classList.add('visible');
                  bluecloud.classList.add('visible');
                  greencloud.classList.add('visible');
                  orangecloud.classList.add('visible');
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

    this.store.dispatch(new GetRanking());
    this.communityLeaderboard$.subscribe((leaderboard) => {
      if (leaderboard) {
        this.communityLeaderboard = leaderboard;
        this.communityLeaderboard.forEach((community) => {
          if (community.name === communityName) {
            this.position = community.position;
          }
        });
      }
    });

    this.store.dispatch(new GetCommunityPosts(communityName));
    this.communityPosts$.subscribe((posts) => {
      if (posts) {
        this.communityPosts = posts;
        // console.log(posts);

        // for (let i = 0; i < posts.length; i++) {
        //   this.sharing.push(false);

        //   if (
        //     posts[i].dateAdded != null &&
        //     posts[i].comments != null &&
        //     posts[i].shares != null
        //   ) {
        //     this.shares.push(posts[i].shares);
        //   }
        // }
        this.loading = false;
      }
    });

    

    this.store.dispatch(new GetByCommunity(communityName));
    this.events$.subscribe((events) => {
      if(events){
        // console.log(events)
        this.events = events
      }
    })
  }

  postForm = this.formBuilder.group({
    text: ['', Validators.maxLength(80)],
    rules: ['', Validators.maxLength(200)],
  });

  get text() {
    return this.postForm.get('text');
  }

  get rules() {
    return this.postForm.get('rules');
  }

  GoToComments(postId: string) {
    this.router.navigate(['home/app-comments-feature/' + postId]);
  }
  async Share(n: number, post: PostDto) {
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

    this.store.dispatch(new UpdatePostArray(post._id, data));
    this.communityApi.addCoins(post.username, 1);

    const link: string = obj + '/home/app-comments-feature/' + post._id;

    await navigator.clipboard.writeText(link);

    const toast = await this.toastController.create({
      message: 'Url Copied to Clipboard',
      duration: 2000,
      color: 'success',
    });

    await toast.present();
  }

  OpenRemove() {
    this.RemoveMember = !this.RemoveMember;
  }
  Edit() {
    this.edit = true;
  }
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

  async onSubmit() {
    // console.log('OH HELLO THERE!!!!!!');
    if (this.community == null) {
      return;
    }

    let textData: string;
    let rulesData: string;
    let imageUrl: string | null;
    let bannerUrl: string | null;

    const toast = await this.toastController.create({
      message: 'Updating Community',
      color: 'success'
    })

    toast.present();

    if (this.file) {
      imageUrl = await this.uploadImage(this.file, this.fileName);

      if (imageUrl == null) {
        imageUrl = this.community?.groupImage;
      }
    } else {
      imageUrl = this.community?.groupImage;
    }

    if (this.fileBanner) {
      bannerUrl = await this.uploadImage(this.fileBanner, this.fileNameBanner);

      if (bannerUrl == null) {
        bannerUrl = this.community?.bannerImage;
      }
    } else {
      bannerUrl = this.community?.bannerImage;
    }

    if (
      this.text?.value == null ||
      this.text?.value == undefined ||
      this.text?.value == ''
    ) {
      textData = this.community?.about;
    } else {
      textData = this.text?.value;
    }

    if (
      this.rules?.value == null ||
      this.rules?.value == undefined ||
      this.rules?.value == ''
    ) {
      rulesData = this.community?.rules;
    } else {
      rulesData = this.rules?.value;
    }

    const data: UpdateCommunityRequest = {
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
      communityEP: this.community?.communityEP,
    };

    this.store.dispatch(new UpdateCommunity(this.community?._id, data));
    toast.dismiss();

    // const toast1 = await this.toastController.create({
    //   message: 'Community successfully updated',
    //   duration: 2000,
    //   color: 'success'
    // })

    // await toast1.present();

    this.postForm.reset();
  }

  async uploadImage(file: File, fileName: string): Promise<string | null> {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', file, fileName);

      const uploadFile = this.communityApi.uploadFile(formData);
      // console.log(uploadFile);
      resolve(uploadFile);
    });
  }

  Remove(m: string, i: number) {
    this.removedMember[i] = true;
    this.UpdatedMyMembers = this.UpdatedMyMembers.filter((x) => x != m);
    // console.log('REMOVE CALLED');
    // console.log('My Members: ' + this.myMembers);
    // console.log('Updated My Members: ' + this.UpdatedMyMembers);
    this.removedlist.push(m);
  }

  Undo(m: string, i: number) {
    this.removedMember[i] = false;
    this.UpdatedMyMembers.push(m);

    // console.log('UNDO CALLED');
    // console.log('My Members: ' + this.myMembers);
    // console.log('Updated My Members: ' + this.UpdatedMyMembers);
    this.removedlist = this.removedlist.filter((x) => x != m);
  }

  CancelUpdate() {
    for (let i = 0; i < this.removedMember.length; i++) {
      this.removedMember[i] = false;
    }
    this.UpdatedMyMembers = this.myMembers;
    this.RemoveMember = false;

    // console.log('CANCEL CALLED');
    // console.log('My Members: ' + this.myMembers);
    // console.log('Updated My Members: ' + this.UpdatedMyMembers);
    this.removedlist = [];
  }
  async UpdateCommunity() {
    this.RemoveMember = false;
    if (this.profile == null || this.community == null) {
      return;
    }

    for (let i = 0; i < this.removedMember.length; i++) {
      this.removedMember[i] = false;
    }

    this.myMembers = this.UpdatedMyMembers;
    this.myMembers.push(this.profile?.username);
    // console.log('UPDATE CALLED');
    // console.log('My Members: ' + this.myMembers);
    // console.log('Updated My Members: ' + this.UpdatedMyMembers);

    let newEP = this.community.communityEP;

    this.removedlist.forEach(async (member) => {
      const newUser = await this.communityApi.getUser(member);

      if (newUser === null || newUser === undefined) {
        return;
      }

      newEP -= newUser.ep;
    });

    const communityName = this.community?.name;

    this.removedlist.forEach((member) => {
      this.store.dispatch(new RemoveOtherUserCommunity(communityName, member));
    });

    const data: UpdateCommunityRequest = {
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
      communityEP: newEP,
    };

    this.store.dispatch(new UpdateCommunity(this.community?._id, data));
  }
  join() {
    if (this.profile == null || this.community == null) {
      return;
    }

    const newMembers: string[] = [
      ...this.community.members,
      this.profile.username,
    ];
    const newEP: number = this.profile.ep + this.community.communityEP;

    const data: UpdateCommunityRequest = {
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
      communityEP: newEP,
    };

    this.store.dispatch(new UpdateCommunity(this.community?._id, data));
    this.store.dispatch(
      new AddCommunity(this.community.name, this.profile.username)
    );
  }

  leave() {
    if (this.profile == null || this.community == null) {
      return;
    }
    const ourProfile: string = this.profile.username;

    const newMembers: string[] = this.community.members.filter(
      (member) => member != ourProfile
    );
    const newEP: number = this.community.communityEP - this.profile.ep;

    const data: UpdateCommunityRequest = {
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
      communityEP: newEP,
    };

    this.store.dispatch(new UpdateCommunity(this.community?._id, data));
    this.store.dispatch(
      new RemoveCommunity(this.community.name, this.profile.username)
    );
  }

  requestJoin() {
    if (this.profile == null || this.community == null) {
      return;
    }

    this.store.dispatch(
      new AddCommunityRequest(this.community?._id, this.profile.username)
    );
  }

  requestUnjoin() {
    if (this.profile == null || this.community == null) {
      return;
    }

    this.store.dispatch(
      new RemoveCommunityRequest(this.community?._id, this.profile.username)
    );
  }

  async acceptUser(username: string) {
    if (this.profile == null || this.community == null) {
      return;
    }

    const newUser = await this.communityApi.getUser(username);

    if (newUser === null || newUser === undefined) {
      return;
    }

    const newMembers: string[] = [...this.community.members, username];
    const newEP: number = this.community.communityEP + newUser.ep;

    const data: UpdateCommunityRequest = {
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
      communityEP: newEP,
    };

    // console.log(this.profile);
    this.store.dispatch(new UpdateCommunity(this.community?._id, data));
    this.store.dispatch(
      new RemoveCommunityRequest(this.community?._id, username)
    );
    this.communityApi.addCommunity(username, this.community.name);

    // console.log(this.profile);
  }

  rejectUser(username: string) {
    if (this.profile == null || this.community == null) {
      return;
    }

    this.store.dispatch(
      new RemoveCommunityRequest(this.community?._id, username)
    );
  }
  //***********************************UI FUNCTIONS**************************************************** */
  recChange() {
    const recBtn = document.getElementById('recommendedBtn');
    const eventBtn = document.getElementById('eventBtn');

    if (recBtn && eventBtn) {
      recBtn.classList.add('active-button');
      eventBtn.classList.remove('active-button');
    }

    this.showPosts = true;
    this.showEvents = false;
  }

  eventChange() {
    const recBtn = document.getElementById('recommendedBtn');
    const eventBtn = document.getElementById('eventBtn');

    if (recBtn && eventBtn) {
      recBtn.classList.remove('active-button');
      eventBtn.classList.add('active-button');
    }

    this.showPosts = false;
    this.showEvents = true;
  }

  GoToProfile(username: string) {
    if (this.profile?.username !== username) {
      this.router.navigate(['home/user-profile/' + username]);
    } else {
      this.router.navigate(['home/profile']);
    }
  }

  Report(n: number) {
    if (this.posts?.length == null) {
      return;
    }

    if (this.reports[n] == true) {
      this.reports[n] = false;
      return;
    } else {
      for (let k = 0; k < this.reports.length; k++) {
        this.reports[k] = false;
      }
      this.reports[n] = true;
    }
  }

  ReportPost(n: number, post: PostDto) {
    if (this.posts?.length == null) {
      return;
    }

    this.reports[n] = false;

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
      shares: post.shares,
      comments: post.comments,
      reported: true,
    };

    this.store.dispatch(new UpdatePostArray(post._id, data));
  }

  Like(n: number, post: PostDto) {
    if (this.profile == null) {
      return;
    }

    this.store.dispatch(new LikeCommunityPostArray(post._id, this.profile._id));
  }

  Dislike(n: number, post: PostDto) {
    if (this.profile == null) {
      return;
    }

    this.store.dispatch(new DislikeCommunityPostArray(post._id, this.profile._id));
  }

  mobileview = false;

  updateMobileView() {
    this.mobileview = window.innerWidth <= 992;
  }

  ngOnInit() {
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));
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

  goToEvents() {
    this.router.navigate(['/home/event']);
  }
}
