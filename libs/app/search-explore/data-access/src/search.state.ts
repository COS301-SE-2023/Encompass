import { Injectable } from '@angular/core';
import { CommunityDto } from '@encompass/api/community/data-access';
import { PostDto } from '@encompass/api/post/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SearchApi } from './search.api';
import {
  GetAllCommunities,
  GetAllProfiles,
  SearchCommunities,
  SearchPosts,
  SearchProfiles,
} from '@encompass/app/search-explore/util';
import {
  UpdatePost,
} from '@encompass/app/search-explore/util';

export interface SearchModel {
  SearchPostsForm: {
    model: {
      posts: PostDto[] | null | undefined;
    };
  };
}

export interface SearchProfilesModel {
  SearchProfilesForm: {
    model: {
      profiles: ProfileDto[] | null | undefined;
    };
  };
}

export interface SearchCommunitiesModel {
  SearchCommunitiesForm: {
    model: {
      communities: CommunityDto[] | null | undefined;
    };
  };
}

export interface getAllProfilesModel {
  GetAllProfilesForm: {
    model: {
      profiles: ProfileDto[] | null | undefined;
    };
  };
}

@State<SearchModel>({
  name: 'searchPostsByCategory',
  defaults: {
    SearchPostsForm: {
      model: {
        posts: null,
      },
    },
  },
})
@State<SearchModel>({
  name: 'searchPosts',
  defaults: {
    SearchPostsForm: {
      model: {
        posts: null,
      },
    },
  },
})
@State<SearchProfilesModel>({
  name: 'searchProfiles',
  defaults: {
    SearchProfilesForm: {
      model: {
        profiles: null,
      },
    },
  },
})
@State<SearchCommunitiesModel>({
  name: 'searchCommunities',
  defaults: {
    SearchCommunitiesForm: {
      model: {
        communities: null,
      },
    },
  },
})

@Injectable()
export class SearchState {
  constructor(private searchApi: SearchApi) {}

  
  @Action(SearchPosts)
  async searchPosts(ctx: StateContext<SearchModel>, { keyword }: SearchPosts) {
    const response = await this.searchApi.getPostsByKeyword(keyword);

    if (response == null || response == undefined) {
      return;
    }

    ctx.setState({
      SearchPostsForm: {
        model: {
          posts: response,
        },
      },
    });
  }

  @Action(SearchProfiles)
  async searchProfiles(
    ctx: StateContext<SearchProfilesModel>,
    { keyword }: SearchProfiles
  ) {
    const response = await this.searchApi.getProfilesByKeyword(keyword);

    if (response == null || response == undefined) {
      return;
    }

    ctx.setState({
      SearchProfilesForm: {
        model: {
          profiles: response,
        },
      },
    });
  }

  @Action(SearchCommunities)
  async searchCommunities(
    ctx: StateContext<SearchCommunitiesModel>,
    { keyword }: SearchCommunities
  ) {
    const response = await this.searchApi.getCommunitiesByKeyword(keyword);

    if (response == null || response == undefined) {
      return;
    }

    ctx.setState({
      SearchCommunitiesForm: {
        model: {
          communities: response,
        },
      },
    });
  }

  @Action(UpdatePost)
  async updatePost(ctx: StateContext<SearchModel>, {postId, updateRequest}: UpdatePost){
    const response = await this.searchApi.updatePost(postId, updateRequest);

    if(response == null || response == undefined){
      return;
    }

    try{
      const posts = await ctx.getState().SearchPostsForm.model.posts;

      if(posts == null ){
        console.log("POSTS IS NULL")
        return;
      }

      const index = await posts.findIndex(x => x._id == response._id)

      console.log(posts[index])

      posts[index] = response;

      console.log(posts[index])

      ctx.patchState({
        SearchPostsForm: {
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
  static searchPosts(state: SearchModel) {
    return state.SearchPostsForm.model.posts;
  }

  @Selector()
  static searchProfiles(state: SearchProfilesModel) {
    return state.SearchProfilesForm.model.profiles;
  }

  @Selector()
  static searchCommunities(state: SearchCommunitiesModel) {
    return state.SearchCommunitiesForm.model.communities;
  }

  @Selector()
  static posts(state: SearchModel){
    return state.SearchPostsForm.model.posts;
  }
}