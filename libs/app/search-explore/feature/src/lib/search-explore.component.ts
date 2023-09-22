import { Component, Inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ModalController, ToastController } from '@ionic/angular';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
// import { GetAllPosts, UpdatePost } from '@encompass/app/home-page/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SearchApi,
  SearchState,
} from '@encompass/app/search-explore/data-access';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { GetUserSettings } from '@encompass/app/settings/util';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { takeUntil, pipe, Subject, take } from 'rxjs';
import { CommunityDto } from '@encompass/api/community/data-access';
import {
  DislikeArray,
  GetAllCommunities,
  LikeArray,
  SearchCommunities,
  SearchPosts,
  SearchProfiles,
} from '@encompass/app/search-explore/util';
import { PostsState } from '@encompass/app/posts/data-access';
import { UpdatePost } from '@encompass/app/search-explore/util';
import { HomeApi } from '@encompass/app/home-page/data-access';

@Component({
  selector: 'search-explore',
  templateUrl: './search-explore.component.html',
  styleUrls: ['./search-explore.component.scss'],
})
export class SearchExploreComponent {
  requiredFileType = ['image/png', 'image/jpg', 'image/jpeg'];

  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>; //get current profile
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>; //get current settings

  @Select(SearchState.searchPosts) searchPosts$!: Observable<PostDto[] | null>; //get posts by keyword
  @Select(SearchState.searchProfiles) searchProfiles$!: Observable<
    ProfileDto[] | null
  >; //get profiles by keyword
  @Select(SearchState.searchCommunities) searchCommunities$!: Observable<
    CommunityDto[] | null
  >; //get communities by keyword

  private unsubscribe$: Subject<void> = new Subject<void>();
  // myCommunities!: CommunityDto[] | null;

  profile!: ProfileDto;
  // posts: PostDto[] = [];
  // relatedCommunities: string[] = [];
  // communities!: CommunityDto[];
  // relatedCommunitiesArray: CommunityDto[] = [];
  // profiles!: ProfileDto[];
  // settings!: SettingsDto | null;

  keyword = '';
  communities: CommunityDto[] = [];
  profiles: ProfileDto[] = [];
  posts: PostDto[] = [];
  communityMentions: string[] = [];
  postsIsFetched = false;
  datesAdded: Date[] = [];
  comments: number[] = [];
  shares: number[] = [];
  likes: number[] = [];
  likedComments: boolean[] = [];
  sharing: boolean[] = [];
  size = 0;
  themeName!: string;
  reports: boolean[] = [];
  postReported: boolean[] = [];
  isCommunitiesFetched = false;
  isProfilesFetched = false;
  isPostsFetched = false;
  postsExists = false;
  commsExists = false;
  profilesExists = false;
  communitiesIsFetched = false;
  profilesIsFetched = false;
  cardExists: boolean | undefined;
  profileHasContent: boolean | undefined;
  commsHasContent: boolean | undefined;
  postsHasContent: boolean | undefined;
  showMoreCommunities = false;
  showMoreProfiles = false;
  noSearch = true;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private store: Store,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private searchApi: SearchApi,
    private toastController: ToastController,
    private homeApi: HomeApi
  ) {
    this.searchCommunities$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((communities) => {
        if (communities) {
          this.commsHasContent = true;
          // console.log("POSTS:")
          this.communities = [];
          const communityCount = communities;
          const temp = communities;
          temp.forEach((community) => {
            this.communities.push(community);

            if (
              community.name.toLowerCase().includes(this.keyword.toLowerCase())
            ) {
              communityCount.push(community);
            }
          });
        }
      });

    if (!this.profilesIsFetched) {
      this.profilesIsFetched = true;
      this.searchProfiles$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((profiles) => {
          if (profiles) {
            this.profileHasContent = true;
            // console.log("POSTS:")
            this.profiles = [];
            const profileCount = profiles;
            const temp = profiles;
            temp.forEach((profile) => {
              this.profiles.push(profile);

              if (
                profile.name.toLowerCase().includes(this.keyword.toLowerCase())
              ) {
                profileCount.push(profile);
              }
            });
          }
        });
    }
  }

  async search(event: any) {
    this.keyword = event.detail.value;
    // console.log(this.keyword);
    this.postsTab();

    if (this.keyword == '') {
      this.clearSearch();
      return;
    } else {
      this.postsExists = true;
      this.searchCommunities();
      this.searchProfiles();
      this.searchPosts();
      this.noSearch = false;
    }
  }

  clearSearch() {
    this.keyword = '';
    this.postsIsFetched = false;
    this.communitiesIsFetched = false;
    this.profilesIsFetched = false;
    this.postsHasContent = false;
    this.commsHasContent = false;
    this.profileHasContent = false;
    this.postsExists = false;
    this.commsExists = false;
    this.profilesExists = false;
    this.noSearch = true;
    // this.communities = [];
    // this.profiles = [];
    // this.posts = [];
  }

  async searchCommunities() {
    this.store.dispatch(new SearchCommunities(this.keyword));

    if (!this.communitiesIsFetched) {
      this.communitiesIsFetched = true;
    }

    this.searchCommunities$.subscribe((communities) => {
      // this.commsHasContent = false;
      if (communities) {
        // console.log('commlengths:' + this.communities.length);
        if (this.communities.length <= 0) {
          this.commsHasContent = false;
        }
        if (this.communities.length > 0) {
          this.commsHasContent = true;
        }
        if (this.communities.length >= 4) {
          this.showMoreCommunities = true;
        }
        // console.log("commsHasContent: " + this.commsHasContent);
      }
    });
  }

  async searchProfiles() {
    this.store.dispatch(new SearchProfiles(this.keyword));

    if (!this.profilesIsFetched) {
      this.profilesIsFetched = true;
    }

    this.searchProfiles$.subscribe((profiles) => {
      // this.profileHasContent = false;
      if (profiles) {
        if (this.profiles.length <= 0) {
          this.profileHasContent = false;
        }
        if (this.profiles.length > 0) {
          this.profileHasContent = true;
        }
        if (this.profiles.length >= 6) {
          this.showMoreProfiles = true;
        }
        // console.log("profilehascontent: " + this.profileHasContent);
      }
    });
  }

  //=========================================================================post things=========================================================================================

  async searchPosts() {
    this.store.dispatch(new SearchPosts(this.keyword, this.profile._id));
    // this.postsHasContent = true;

    // if (!this.postsIsFetched) {
    //   this.postsIsFetched = true;
    //   this.searchPosts$
    //     .pipe(takeUntil(this.unsubscribe$))
    //     .subscribe((posts) => {
    //       if (posts) {
    //         this.postsHasContent = true;
    //         // console.log("POSTS:")
    //         this.posts = [];
    //         const postsCount = posts;
    //         const temp = posts;
    //         temp.forEach((post) => {
    //           this.posts.push(post);
    //           postsCount.push(post);
    //         });
    //       }
    //     });
    // }
    await this.updatePosts();
  }

  async updatePosts() {
    this.searchPosts$.subscribe((posts) => {
      if (posts) {
        this.posts = posts

        if (this.posts.length <= 0) {
          this.postsHasContent = false;
        }
        if (this.posts.length > 0) {
          this.postsHasContent = true;
        }
        // const temp = posts.filter((post) => {
        //   if (post.isPrivate) {
        //     return this.profile?.communities.includes(post.community);
        //   } else {
        //     return true;
        //   }
        // });

        // this.posts = temp;
        // console.log("postsHasContent: " + this.postsHasContent);
      }
    });
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

  async Like(n: number, post: PostDto) {
    if (this.profile == null) {
      return;
    }

    await this.store.dispatch(new LikeArray(post._id, this.profile._id));
    // this.posts = []
    // this.updatePosts();
    // this.searchPosts$.subscribe((posts) => {
    //   if (posts) {
    //     const temp = posts.filter((post) => {
    //       if (post.isPrivate) {
    //         return this.profile?.communities.includes(post.community);
    //       } else {
    //         return true;
    //       }
    //     });

    //     this.posts = temp;

    //     this.size = this.posts.length - 1;

    //     if (this.posts.length <= 0) {
    //       this.postsHasContent = false;
    //     }
    //     if (this.posts.length > 0) {
    //       this.postsHasContent = true;
    //     }
    //     // console.log("postsHasContent: " + this.postsHasContent);
    //   }
    // });
  }

  async Dislike(n: number, post: PostDto) {
    if (this.profile == null) {
      return;
    }

    await this.store.dispatch(new DislikeArray(post._id, this.profile._id));
    // this.posts = []
    // this.updatePosts();

    // this.searchPosts$.subscribe((posts) => {
    //   if (posts) {
    //     const temp = posts.filter((post) => {
    //       if (post.isPrivate) {
    //         return this.profile?.communities.includes(post.community);
    //       } else {
    //         return true;
    //       }
    //     });

    //     this.posts = temp;

    //     this.size = this.posts.length - 1;

    //     if (this.posts.length <= 0) {
    //       this.postsHasContent = false;
    //     }
    //     if (this.posts.length > 0) {
    //       this.postsHasContent = true;
    //     }
    //     // console.log("postsHasContent: " + this.postsHasContent);
    //   }
    // });
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

    this.store.dispatch(new UpdatePost(post._id, data));
    this.homeApi.removeCoins(post.username, 1);
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

  //==============================================================navigation=====================================================

  GoToCommunity(communityName: string) {
    this.router.navigate(['home/community-profile/' + communityName]);
  }

  GoToProfile(username: string) {
    if (this.profile?.username !== username) {
      this.router.navigate(['home/user-profile/' + username]);
    } else {
      this.router.navigate(['home/profile']);
    }
  }

  GoToComments(postId: string) {
    this.router.navigate(['home/app-comments-feature/' + postId]);
  }

  postsTab() {
    this.postsExists = true;
    this.commsExists = false;
    this.profilesExists = false;
  }

  commsTab() {
    this.postsExists = false;
    this.commsExists = true;
    this.profilesExists = false;
  }

  profilesTab() {
    this.postsExists = false;
    this.commsExists = false;
    this.profilesExists = true;
  }

  mobileview = false;

  updateMobileView() {
    this.mobileview = window.innerWidth <= 992;
  }

  ngOnInit() {
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));

    this.store.dispatch(new SubscribeToProfile());

    this.profile$.subscribe((profile) => {
      if (profile) {
        // console.log('Profile CALLED');
        // console.log(profile);
        this.profile = profile;
      }
    });
  }

  buttonStates: { [key: string]: boolean } = {};

  handleButtonClick(buttonId: string, communityName: string) {
    // Toggle the state of the button
    this.buttonStates[buttonId] = !this.buttonStates[buttonId];

    // Implement your logic here (e.g., adding or removing the community)
    if (this.buttonStates[buttonId]) {
      // Community is added
      console.log(`Added ${communityName}`);
    } else {
      // Community is removed
      console.log(`Removed ${communityName}`);
    }
  }

  buttonStatesPeople: { [key: string]: boolean } = {};

  // Function to handle following/unfollowing a person
  handleFollowButtonClick(buttonId: string, username: string) {
    // Toggle the state of the button
    this.buttonStatesPeople[buttonId] = !this.buttonStatesPeople[buttonId];

    // Implement your logic here for following/unfollowing the person
    if (this.buttonStatesPeople[buttonId]) {
      // Person is followed
      console.log(`You are now following ${username}`);
    } else {
      // Person is unfollowed
      console.log(`You have unfollowed ${username}`);
    }
  }
}
