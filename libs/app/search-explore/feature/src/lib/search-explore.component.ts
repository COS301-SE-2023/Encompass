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
  GetAllCommunities,
  SearchCommunities,
  SearchPosts,
  SearchProfiles,
} from '@encompass/app/search-explore/util';
import { PostsState } from '@encompass/app/posts/data-access';
import {
  UpdatePost,
} from '@encompass/app/search-explore/util';
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
  @Select(SearchState.searchPostsByCategory)
  searchPostsByCategory$!: Observable<PostDto[] | null>; //get posts by category
  @Select(SearchState.getAllCommunities) allCommunities$!: Observable<
    CommunityDto[] | null
  >; //get all communities
  @Select(SearchState.getAllProfiles) allProfiles$!: Observable<
    ProfileDto[] | null
  >; //get all profiles

  private unsubscribe$: Subject<void> = new Subject<void>();
  // myCommunities!: CommunityDto[] | null;

  profile!: ProfileDto | null;
  // posts: PostDto[] = [];
  // relatedCommunities: string[] = [];
  // communities!: CommunityDto[];
  // relatedCommunitiesArray: CommunityDto[] = [];
  // profiles!: ProfileDto[];
  // settings!: SettingsDto | null;

  keyword = '';
  communities: CommunityDto[] | null = null;
  profiles: ProfileDto[] | null = null;
  posts: PostDto[] = [];
  communityMentions: string[] = [];
  postsIsFetched = false;
  datesAdded: string[] = [];
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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private store: Store,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private searchApi: SearchApi,
    private toastController: ToastController,
    private homeApi: HomeApi
  ) {}

  async search(event: any) {
    this.keyword = event.detail.value;
    console.log(this.keyword);
    if (this.keyword == '') {
      this.communities = null;
      this.profiles = null;
      this.posts = [];
      this.postsIsFetched = false;
      return;
    }else {
      this.searchCommunities();
      this.searchProfiles();
      this.searchPosts();
    }
  }

  clearSearch() {
    this.keyword = '';
    this.search({ detail: { value: '' } });
  }

  searchCommunities() {
    // console.log('searching communities');
    
    if (!this.isCommunitiesFetched) {
      this.isCommunitiesFetched = true;
      this.store.dispatch(new SearchCommunities(this.keyword));

      this.searchCommunities$.pipe(takeUntil(this.unsubscribe$)).subscribe((communities) => {
        if (communities) {
          
          // console.log('communities', communities);
          this.communities = communities;

        }
      });
    }
  }

  
  

  searchProfiles() {

     // console.log('searching profiles');
    
     if (!this.isProfilesFetched) {
      this.isProfilesFetched = true;
      this.store.dispatch(new SearchProfiles(this.keyword));

      this.searchProfiles$.pipe(takeUntil(this.unsubscribe$)).subscribe((profiles) => {
        if (profiles) {
          
          // console.log('profiles', profiles);
          this.profiles = profiles;

        }
      });
    }
  }

  //=========================================================================post things=========================================================================================

  async searchPosts() {
    if (this.profile == null) {
      return;
    }

    // console.log('searching profiles');
    
    if (!this.isPostsFetched) {
      this.isPostsFetched = true;
      this.store.dispatch(new SearchPosts(this.keyword));

      this.searchPosts$.pipe(takeUntil(this.unsubscribe$)).subscribe((posts) => {
        if (posts) {
          
          // console.log('posts', posts);
          this.posts = posts;

        }
      });
    }
    await this.updatePosts();
  }

  async updatePosts() {
    this.searchPosts$.subscribe((posts) => {
      if (posts) {
        const temp = posts.filter((post) => {
          if (post.isPrivate) {
            return this.profile?.communities.includes(post.community);
          } else {
            return true;
          }
        });

        this.posts = temp;

        this.size = this.posts.length - 1;

        for (let i = 0; i < this.posts.length; i++) {
          this.likedComments.push(false);
          this.sharing.push(false);
          this.reports.push(false);
          this.postReported.push(false);

          if (
            this.posts[i].dateAdded != null &&
            this.posts[i].comments != null &&
            this.posts[i].shares != null
          ) {
            this.datesAdded.push(this.posts[i].dateAdded);
            this.comments.push(this.posts[i].comments);
            this.shares.push(this.posts[i].shares);
          }

          if (this.posts[i].likes != null) {
            this.likes.push(this.posts[i].likes?.length);

            if (this.profile == undefined) {
              return;
            }
            if (this.posts[i].likes.includes(this.profile.username)) {
              this.likedComments[i] = true;
            }
          }
        }
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

  Like(n: number, post: PostDto) {
    let likesArr: string[];

    console.log(this.profile?.username + ' LIKED POST');
    const emptyArray: string[] = [];

    if (this.profile?.username == null) {
      return;
    }

    if (post.likes == emptyArray) {
      likesArr = [this.profile?.username];
    } else {
      likesArr = [...post.likes, this.profile.username];
    }

    const data: UpdatePostRequest = {
      title: post.title,
      text: post.text,
      imageUrl: post.imageUrl,
      communityImageUrl: post.communityImageUrl,
      categories: post.categories,
      likes: likesArr,
      dislikes: post.dislikes.filter(
        (dislike) => dislike !== this.profile?.username
      ),
      spoiler: post.spoiler,
      ageRestricted: post.ageRestricted,
      shares: post.shares,
      comments: post.comments,
      reported: post.reported,
    };
    if (this.profile == null) {
      return;
    }

    this.store.dispatch(new UpdatePost(post._id, data));
    this.homeApi.addCoins(post.username, 1);
  }

  Dislike(n: number, post: PostDto) {
    console.log('dislike');
    this.likedComments[n] = false;
    this.likes[n]--;

    let likesArr = [...post.likes];
    likesArr = likesArr.filter((like) => like !== this.profile?.username);

    let dislikesArr = [...post.dislikes];

    if (this.profile?.username == null) {
      return;
    }

    if (!dislikesArr.includes(this.profile?.username)) {
      dislikesArr = [...post.dislikes, this.profile?.username];
    }

    const data: UpdatePostRequest = {
      title: post.title,
      text: post.text,
      imageUrl: post.imageUrl,
      communityImageUrl: post.communityImageUrl,
      categories: post.categories,
      likes: likesArr,
      dislikes: dislikesArr,
      spoiler: post.spoiler,
      ageRestricted: post.ageRestricted,
      shares: post.shares,
      comments: post.comments,
      reported: post.reported,
    };

    if (this.profile == null) {
      return;
    }

    this.store.dispatch(new UpdatePost(post._id, data));
    this.homeApi.removeCoins(post.username, 1);

    // this.addPosts();
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
}
