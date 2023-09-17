import { Injectable } from "@angular/core";
import { HomeApi } from "./home.api";
import { Action, Selector, State, StateContext } from "@ngxs/store";
// import { ClearNotification, GetAllPosts, GetNotifications, SendNotification, UpdatePost, getHome } from "@encompass/app/home-page/util";
// import { ClearNotification, SendNotification, GetAllPosts, GetLatestPosts, GetNotifications, GetPopularPosts, UpdatePost, getHome } from "@encompass/app/home-page/util";
import { ClearNotification, SendNotification, GetNotifications, GetRecommendedBooks, GetRecommendedCommunities, GetRecommendedMovies, ClearAllNotifications, GetRecommendedPodcasts, UpdateCommunity } from "@encompass/app/home-page/util";
import { HomeDto } from "@encompass/api/home/data-access";
import { PostDto } from "@encompass/api/post/data-access";
import { NotificationDto } from "@encompass/api/notifications/data-access";
import { CommunityDto } from "@encompass/api/community/data-access";
import { MovieDto } from "@encompass/api/media-recommender/data-access";
import { BookDto } from "@encompass/api/media-recommender/data-access";
import { PodcastDto } from "@encompass/api/media-recommender/data-access";

// export interface HomePostsModel{
//   HomePostsForm: {
//     model: {
//       homePosts: PostDto[] | null
//     }
//   }
// }

export interface HomeNotificationsModel{
  HomeNotificationsForm: {
    model: {
      homeNotifications: NotificationDto | null
    }
  }
}

export interface CommunitiesModel{
  CommunitiesForm: {
    model: {
      communities: CommunityDto[] | null
    }
  }
}

export interface MoviesModel{
  MoviesForm: {
    model: {
      movies: MovieDto[] | null
    }
  }
}

export interface BooksModel{
  BooksForm: {
    model: {
      books: BookDto[] | null
    }
  }
}

export interface PocastsModel{
  PodcastsForm: {
    model: {
      podcasts: PodcastDto[] | null
    }
  }
}

@State<BooksModel>({
  name: 'recommendedBooks',
  defaults: {
    BooksForm: {
      model: {
        books: null
      }
    }
  }
})

@State<MoviesModel>({
  name: 'recommendedMovies',
  defaults: {
    MoviesForm: {
      model: {
        movies: null
      }
    }
  }
})

@State<PocastsModel>({
  name: 'recommendedPodcasts',
  defaults: {
    PodcastsForm: {
      model: {
        podcasts: null
      }
    }
  }
})

@State<CommunitiesModel>({
  name: 'recommendedComunities',
  defaults: {
    CommunitiesForm: {
      model: {
        communities: null
      }
    }
  }
})

// @State<HomePostsModel>({
//   name: 'homePosts',
//   defaults: {
//     HomePostsForm: {
//       model: {
//         homePosts: null
//       }
//     }
//   }
// })

@State<HomeNotificationsModel>({
  name: 'homeNotifications',
  defaults: {
    HomeNotificationsForm: {
      model: {
        homeNotifications: null
      }
    }
  }
})

@Injectable()
export class HomeState{
  constructor(private homeApi: HomeApi){}

  @Action(GetRecommendedMovies)
  async getRecommendedMovies(ctx: StateContext<MoviesModel>, {userId}: GetRecommendedMovies){
    const response = await this.homeApi.getRecommendedMovies(userId);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      MoviesForm: {
        model: {
          movies: response
        }
      }
    })
  }

  @Action(GetRecommendedBooks)
  async getRecommendedBooks(ctx: StateContext<BooksModel>, {userId}: GetRecommendedBooks){
    const response = await this.homeApi.getRecommendedBooks(userId);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      BooksForm: {
        model: {
          books: response
        }
      }
    })
  }

  @Action(GetRecommendedPodcasts)
  async getRecommendedPodcasts(ctx: StateContext<PocastsModel>, {userId}: GetRecommendedPodcasts){
    const response = await this.homeApi.getRecommendedPodcasts(userId);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      PodcastsForm: {
        model: {
          podcasts: response
        }
      }
    })
  }

  @Action(GetRecommendedCommunities)
  async getRecommendedCommunities(ctx: StateContext<CommunitiesModel>, {userId, username}: GetRecommendedCommunities){
    const response = await this.homeApi.getRecommendedCommunites(userId, username);

    console.log("Response", response)

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      CommunitiesForm: {
        model: {
          communities: response
        }
      }
    })
  }

  @Action(UpdateCommunity)
  async updateCommunity(ctx: StateContext<CommunitiesModel>, {communityId, updateCommunityRequest}: UpdateCommunity){
    const response = await this.homeApi.updateCommunity(communityId, updateCommunityRequest);

    if(response == null || response == undefined){
      return;
    }

    let communities = ctx.getState().CommunitiesForm.model.communities;

    if(communities == null){
      return;
    }

    const index = communities?.findIndex(x => x._id === response._id)

    communities[index] = response;

    ctx.setState({
      CommunitiesForm: {
        model: {
          communities: communities
        }
      }
    })
  }

  @Action(GetNotifications)
  async getNotifications(ctx: StateContext<HomeNotificationsModel>, {userId}: GetNotifications){
    const response = await this.homeApi.getNotifications(userId);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      HomeNotificationsForm: {
        model: {
          homeNotifications: response
        }
      }
    })
  }

  // @Action(GetLatestPosts)
  // async getLatestPosts(ctx: StateContext<HomePostsModel>, {username}: GetLatestPosts){
  //   const response = await this.homeApi.getLatestPosts(username);
  //   console.log(response);

  //   if(response == null || response == undefined){
  //     return;
  //   }

  //   ctx.setState({
  //     HomePostsForm: {
  //       model: {
  //         homePosts: response
  //       }
  //     }
  //   })
  // }

  // @Action(GetPopularPosts)
  // async getPopularPosts(ctx: StateContext<HomePostsModel>){
  //   const response = await this.homeApi.getPopularPosts();
  //   console.log(response);

  //   if(response == null || response == undefined){
  //     return;
  //   }

  //   ctx.setState({
  //     HomePostsForm: {
  //       model: {
  //         homePosts: response
  //       }
  //     }
  //   })
  // }

  // @Action(GetAllPosts)
  // async getAllPosts(ctx: StateContext<HomePostsModel>, {username}: GetAllPosts){
  //   const response = await this.homeApi.getRecommendPosts(username);
  //   console.log(response);

  //   if(response == null || response == undefined){
  //     return;
  //   }
    
  //   ctx.setState({
  //     HomePostsForm: {
  //       model: {
  //         homePosts: response
  //       }
  //     }
  //   })
  // }

  // @Action(UpdatePost)
  // async updatePost(ctx: StateContext<HomePostsModel>, {postId, updateRequest}: UpdatePost){

  //   const response = await this.homeApi.updatePost(updateRequest, postId);

  //   if(response == null || response == undefined){
  //     return;
  //   }

  //   try{
  //     const posts = ctx.getState().HomePostsForm.model.homePosts;

  //     if(posts == null ){
  //       return
  //     }

  //     const index = posts?.findIndex(x => x._id == response._id)

  //     posts[index] = response;

  //     ctx.setState({
  //       HomePostsForm: {
  //         model: {
  //           homePosts: posts
  //         }
  //       }
  //     })
  //   }

  //   catch(error){
  //     console.log("here")
  //   }
  // }

  // @Action(UpdatePostWithType)
  // async updatePostWithType(ctx: StateContext<HomePostsModel>, {postId, updateRequest, type, username}: UpdatePostWithType){

  //   const response = await this.homeApi.updatePost(updateRequest, postId);

  //   if(response == null || response == undefined){
  //     return;
  //   }

  //   try{
  //     let posts: PostDto[] | null | undefined = [];

  //     if(type == "latest"){
  //       posts = await this.homeApi.getLatestPosts(username);
  //     }

  //     else if(type == "popular"){
  //       posts = await this.homeApi.getPopularPosts();
  //     }

  //     else{
  //       // posts = await this.homeApi.getRecommendPosts(updateRequest.username);
  //     }

  //     if(posts === undefined){
  //       return;
  //     }

  //     ctx.setState({
  //       HomePostsForm: {
  //         model: {
  //           homePosts: posts
  //         }
  //       }
  //     })
  //   }

  //   catch(error){
  //     console.log("here")
  //   }
  // }

  @Action(SendNotification)
  async sendNotification(ctx: StateContext<HomeNotificationsModel>, {userId, notification}: SendNotification){
    // console.log("state")
    await this.homeApi.sendNotification(userId, notification);
  }

  @Action(ClearNotification)
  async clearNotification(ctx: StateContext<HomeNotificationsModel>, {userId, id}: ClearNotification){
    const response = await this.homeApi.clearNotification(userId, id);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      HomeNotificationsForm: {
        model: {
          homeNotifications: response
        }
      }
    })
  }

  @Action(ClearAllNotifications)
  async clearAllNotifications(ctx: StateContext<HomeNotificationsModel>, {userId}: ClearAllNotifications){
    const response = await this.homeApi.clearAllNotifications(userId);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      HomeNotificationsForm: {
        model: {
          homeNotifications: response
        }
      }
    })
  }

  // @Selector()
  // static homePosts(state: HomePostsModel){
  //   return state.HomePostsForm.model.homePosts;
  // }

  @Selector()
  static notifications(state: HomeNotificationsModel){
    return state.HomeNotificationsForm.model.homeNotifications;
  }

  @Selector()
    static getCommunities(state: CommunitiesModel){
      return state.CommunitiesForm.model.communities;
    }
  
    @Selector()
    static getMovies(state: MoviesModel){
      return state.MoviesForm.model.movies;
    } 

    @Selector()
    static getBooks(state: BooksModel){ 
      return state.BooksForm.model.books;
    }

    @Selector()
    static getPodcasts(state: PocastsModel){
      return state.PodcastsForm.model.podcasts;
    }
}