import { Injectable } from "@angular/core";
import { PostDto } from "@encompass/api/post/data-access";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PostsApi } from "./posts.api";
import { CreatePost, DislikePost, DislikePostArray, GetAllPosts, GetLatestPosts, GetPopularPosts, GetPost, GetUserPosts, LikePost, LikePostArray, UpdatePost, UpdatePostArray, UpdateProfilePost } from "@encompass/app/posts/util";
import { UpdateProfilePost as CreatePostProfilePost } from "@encompass/app/profile/util";
import { AddPost } from "@encompass/app/create-community/util";
import { ToastController } from "@ionic/angular";

export interface PostStateModel {
  PostForm: {
    model: {
      post: PostDto | null;
    };
  };
}

export interface PostArrayStateModel{
  PostArrayForm: {
    model: {
      posts: PostDto[] | null;
    };
  };
}

export interface ProfilePostsStateModel{
  ProfilePostsForm: {
    model: {
      posts: PostDto[] | null;
    }
  }
}

@State<ProfilePostsStateModel>({
  name: "profilePosts",
  defaults: {
    ProfilePostsForm: {
      model: {
        posts: null,
      },
    },
  },
})

@State<PostStateModel>({
  name: "posts",
  defaults: {
    PostForm: {
      model: {
        post: null,
      },
    },
  },
})

@State<PostArrayStateModel>({
  name: "postsArray",
  defaults: {
    PostArrayForm: {
      model: {
        posts: null,
      },
    },
  },
})

@Injectable()
export class PostsState {
  constructor(private postsApi: PostsApi, private toastController: ToastController) {}

  @Action(UpdatePost)
  async updatePost(ctx: StateContext<PostStateModel>, { postId, postUpdateRequest }: UpdatePost) {
    const response = await this.postsApi.updatePost(postId, postUpdateRequest);

    if (response == null || response == undefined) {
      return;
    }

    ctx.setState({
      PostForm: {
        model: {
          post: response,
        },
      },
    });
  }

  @Action(CreatePost)
  async createPost(ctx: StateContext<PostArrayStateModel>, {createPostRequest, profile}: CreatePost){
    const communtiy = await this.postsApi.getCommunity(createPostRequest.community);

    if(communtiy != undefined){
      createPostRequest.communityImageUrl = communtiy?.groupImage;
    }
    
    const post = await this.postsApi.createPost(createPostRequest);
    
    console.log(post);
    
    if(post == null || post == undefined){
      return;
    }

    const posts = ctx.getState().PostArrayForm.model.posts;

    if(posts == null){
      return
    }

    posts.unshift(post);

    ctx.patchState({
      PostArrayForm: {
        model: {
          posts: posts
        }
      }
    })

    ctx.dispatch(new AddPost(post.community, post._id));

    let arr;

    if(profile.posts == null){
      arr = [post._id];
    }

    else{
      arr = [...profile.posts, post._id];
    }

    const data  = {
      username: profile.username,
      name: profile.name,
      lastName: profile.lastName,
      categories: profile.categories,
      communities: profile.communities,
      awards: profile.awards,
      events: profile.events,
      followers: profile.followers,
      following: profile.following,
      posts: arr,
      reviews: profile.reviews,
      profileImage: profile.profileImage,
      profileBanner: profile.profileBanner,
      bio: profile.bio,
    }

    ctx.dispatch(new CreatePostProfilePost(data, profile._id));

    const toast = await this.toastController.create({
      message: 'Post Created',
      duration: 2000,
      color: 'success'
    })

    await toast.present();
  }

  @Action(DislikePost)
  async dislikePost(ctx: StateContext<PostStateModel>, { postId, userId }: DislikePost) {
    const response = await this.postsApi.dislikePost(postId, userId);

    if (response == null || response == undefined) {
      return;
    }

    ctx.setState({
      PostForm: {
        model: {
          post: response,
        },
      },
    });
  }

  @Action(LikePost)
  async likePost(ctx: StateContext<PostStateModel>, { postId, userId }: LikePost) {
    const response = await this.postsApi.likePost(postId, userId);

    if (response == null || response == undefined) {
      return;
    }

    ctx.setState({
      PostForm: {
        model: {
          post: response,
        },
      },
    });
  }

  @Action(GetUserPosts)
  async getPosts(ctx: StateContext<ProfilePostsStateModel>, {username, userId}: GetUserPosts){
    const response = await this.postsApi.getPosts(username, userId);
    
    if(response == null || response == undefined){
      return;
    }

    console.log(response);

    return ctx.setState({
      ProfilePostsForm: {
        model: {
          posts: response
        }
      }
    })
  }

  @Action(GetPost)
  async getPost(ctx: StateContext<PostStateModel>, { postId }: GetPost) {
    const response = await this.postsApi.getPost(postId);

    if (response == null || response == undefined) {
      return;
    }

    ctx.setState({
      PostForm: {
        model: {
          post: response,
        },
      },
    });
  }

  // @Action(GetCommunityPosts)
  // async getCommunityPosts(ctx: StateContext<PostArrayStateModel>, {name}: GetCommunityPosts){
  //   const response = await this.postsApi.getCommunityPosts(name);

  //   if(response == null || response == undefined){
  //     return;
  //   }

  //   ctx.setState({
  //     PostArrayForm: {
  //       model: {
  //         posts: response
  //       }
  //     }
  //   })
  // }

  @Action(GetLatestPosts)
  async getLatestPosts(ctx: StateContext<PostArrayStateModel>, {username}: GetLatestPosts){
    const response = await this.postsApi.getLatestPosts(username);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      PostArrayForm: {
        model: {
          posts: response
        }
      }
    })
  }

  @Action(GetPopularPosts)
  async getPopularPosts(ctx: StateContext<PostArrayStateModel>, {userId}: GetPopularPosts){
    const response = await this.postsApi.getPopularPosts(userId);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      PostArrayForm: {
        model: {
          posts: response
        }
      }
    })
  }

  @Action(GetAllPosts)
  async getAllPosts(ctx: StateContext<PostArrayStateModel>, {username}: GetAllPosts){
    const response = await this.postsApi.getRecommendPosts(username);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      PostArrayForm: {
        model: {
          posts: response
        }
      }
    })
  }

  @Action(UpdatePostArray)
  async updatePostArray(ctx: StateContext<PostArrayStateModel>, {postId, postUpdateRequest}: UpdatePostArray){
    const response = await this.postsApi.updatePost(postId, postUpdateRequest);

    if(response == null || response == undefined){
      return;
    }

    try{
      const posts = await ctx.getState().PostArrayForm.model.posts;

      if(posts == null ){
        console.log("POSTS IS NULL")
        return;
      }

      const index = await posts.findIndex(x => x._id == response._id)

      console.log(posts[index])

      posts[index] = response;

      console.log(posts[index])

      ctx.patchState({
        PostArrayForm: {
          model: {
            posts: posts
          }
        }
      })
    }

    catch(error){
      console.log(error)
    }
  }

  @Action(LikePostArray)
  async likedPostArray(ctx: StateContext<PostArrayStateModel>, { postId, userId }: LikePostArray){
    const response = await this.postsApi.likePost(postId, userId);

    if (response == null || response == undefined) {
      return;
    }

    try{
      const posts = await ctx.getState().PostArrayForm.model.posts;

      if(posts == null ){
        console.log("POSTS IS NULL")
        return;
      }

      const index = await posts.findIndex(x => x._id == response._id)
      
      posts[index] = response;

      ctx.patchState({
        PostArrayForm: {
          model: {
            posts: posts
          }
        }
      })
    }

    catch(error){
      console.log(error)
    }

  }


  @Action(DislikePostArray)
  async dislikedPostArray(ctx: StateContext<PostArrayStateModel>, { postId, userId }: DislikePostArray){
    const response = await this.postsApi.dislikePost(postId, userId);

    if (response == null || response == undefined) {
      return;
    }

    try{
      const posts = await ctx.getState().PostArrayForm.model.posts;

      if(posts == null ){
        console.log("POSTS IS NULL")
        return;
      }

      const index = await posts.findIndex(x => x._id == response._id)

      posts[index] = response;

      ctx.patchState({
        PostArrayForm: {
          model: {
            posts: posts
          }
        }
      })
    }
    
    catch(error){
      console.log(error)
    }

  }

  // @Action(LikeProfilePost)
  // async likedProfilePost(ctx: StateContext<ProfilePostsStateModel>, { postId, userId }: LikeProfilePost){
  //   const response = await this.postsApi.likePost(postId, userId);

  //   if (response == null || response == undefined) {
  //     return;
  //   }

  //   try{
  //     const posts = await ctx.getState().ProfilePostsForm.model.posts;

  //     if(posts == null ){
  //       console.log("POSTS IS NULL")
  //       return;
  //     }

  //     const index = await posts.findIndex(x => x._id == response._id)

  //     posts[index] = response;

  //     ctx.patchState({
  //       ProfilePostsForm: {
  //         model: {
  //           posts: posts
  //         }

  //       }
  //     })
  //   }

  //   catch(error){
  //     console.log(error)
  //   }

  // }

  // @Action(DislikeProfilePost)
  // async dislikedProfilePost(ctx: StateContext<ProfilePostsStateModel>, { postId, userId }: DislikeProfilePost){
  //   const response = await this.postsApi.dislikePost(postId, userId);

  //   if (response == null || response == undefined) {
  //     return;
  //   }

  //   try{
  //     const posts = await ctx.getState().ProfilePostsForm.model.posts;

  //     if(posts == null ){
  //       console.log("POSTS IS NULL")
  //       return;
  //     }

  //     const index = await posts.findIndex(x => x._id == response._id)

  //     posts[index] = response;

  //     ctx.patchState({
  //       ProfilePostsForm: {
  //         model: {
  //           posts: posts
  //         }
  //       }
  //     })
  //   }

  //   catch(error){
  //     console.log(error)
  //   }

  // }

  @Action(UpdateProfilePost)
  async updateProfilePost(ctx: StateContext<ProfilePostsStateModel>, {postId, postUpdateRequest}: UpdatePostArray){
    const response = await this.postsApi.updatePost(postId, postUpdateRequest);

    if(response == null || response == undefined){
      return;
    }

    try{
      const posts = await ctx.getState().ProfilePostsForm.model.posts;

      if(posts == null ){
        console.log("POSTS IS NULL")
        return;
      }

      const index = await posts.findIndex(x => x._id == response._id)

      console.log(posts[index])

      posts[index] = response;

      console.log(posts[index])

      ctx.patchState({
        ProfilePostsForm: {
          model: {
            posts: posts
          }
        }
      })
    }

    catch(error){
      console.log(error)
    }
  }

  @Selector()
  static post(state: PostStateModel){
    return state.PostForm.model.post;
  }
  
  @Selector()
  static posts(state: PostArrayStateModel){
    return state.PostArrayForm.model.posts;
  }

  @Selector()
  static profilePosts(state: ProfilePostsStateModel){
    return state.ProfilePostsForm.model.posts;
  }
}