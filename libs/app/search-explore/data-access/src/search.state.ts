import { Injectable } from "@angular/core"
import { CommunityDto } from "@encompass/api/community/data-access"
import { PostDto } from "@encompass/api/post/data-access"
import { ProfileDto } from "@encompass/api/profile/data-access"
import { Action, Selector, State, StateContext } from "@ngxs/store"
import { SearchApi } from "./search.api"
import { GetAllCommunities, GetAllProfiles, SearchCommunities, SearchPosts, SearchPostsByCategory, SearchProfiles } from "@encompass/app/search-explore/util"
import { Get } from "@nestjs/common"
import { GetAccount } from "@encompass/app/settings/util"

export interface SearchModel{
    SearchPostsForm: {
        model: {
            posts: PostDto[] | null | undefined
        }
    }
}

export interface GetAllCommunitiesModel{
    GetAllCommunitiesForm: {
        model: {
            communities: CommunityDto[] | null | undefined
        }
    }
}

export interface SearchPostsByCategoryModel{
    SearchPostsForm: {
        model: {
            posts: PostDto[] | null | undefined
        }
    }
}

export interface SearchProfilesModel{
    SearchProfilesForm: {
        model: {
            profiles: ProfileDto[] | null | undefined
        }
    }
}

export interface SearchCommunitiesModel{
    SearchCommunitiesForm: {
        model: {
            communities: CommunityDto[] | null | undefined
        }
    }
}

export interface getAllProfilesModel{
    GetAllProfilesForm: {
        model: {
            profiles: ProfileDto[] | null | undefined
        }
    }
}

@State<getAllProfilesModel>({
    name: 'getAllProfiles',
    defaults: {
        GetAllProfilesForm: {
            model: {
                profiles: null
            }
        }
    }
})

@State<SearchPostsByCategoryModel>({
    name: 'searchPostsByCategory',
    defaults: {
        SearchPostsForm: {
            model: {
                posts: null
            }
        }
    }
})

@State<SearchModel>({
    name: 'searchPosts',
    defaults: {
        SearchPostsForm: {
            model: {
                posts: null
            }
        }
    }
})

@State<SearchProfilesModel>({
    name: 'searchProfiles',
    defaults: {
        SearchProfilesForm: {
            model: {
                profiles: null
            }
        }
    }
})

@State<SearchCommunitiesModel>({
    name: 'searchCommunities',
    defaults: {
        SearchCommunitiesForm: {
            model: {
                communities: null
            }
        }
    }
})

@State<GetAllCommunitiesModel>({
    name: 'getAllCommunities',
    defaults: {
        GetAllCommunitiesForm: {
            model: {
                communities: null
            }
        }
    }
})


@Injectable()
export class SearchState{
    constructor(private searchApi: SearchApi){}

    @Action(GetAllProfiles)
    async getAllProfiles(ctx: StateContext<getAllProfilesModel>){
        const response = await this.searchApi.getAllProfiles();
        
        if(response == null || response == undefined){
            return;
        }

        ctx.setState({
            GetAllProfilesForm: {
                model: {
                    profiles: response
                }
            }
        })
    }

    @Action(GetAllCommunities)
    async getAllCommunities(ctx: StateContext<GetAllCommunitiesModel>){
        const response = await this.searchApi.getAllCommunities();
        
        if(response == null || response == undefined){
            return;
        }

        ctx.setState({
            GetAllCommunitiesForm: {
                model: {
                    communities: response
                }
            }
        })
    }

    @Action(SearchPosts)
    async searchPosts(ctx: StateContext<SearchModel>, {keyword}: SearchPosts){
        const response = await this.searchApi.getPostsByKeyword(keyword);

        if(response == null || response == undefined){
            return;
        }

        ctx.setState({
            SearchPostsForm: {
                model: {
                    posts: response
                }
            }
        })
    }

    @Action(SearchPostsByCategory)
    async searchPostsByCategory(ctx: StateContext<SearchPostsByCategoryModel>, {category}: SearchPostsByCategory){
        const response = await this.searchApi.getPostsByCategory(category);

        if(response == null || response == undefined){
            return;
        }

        ctx.setState({
            SearchPostsForm: {
                model: {
                    posts: response
                }
            }
        })
    }

    @Action(SearchProfiles)
    async searchProfiles(ctx: StateContext<SearchProfilesModel>, {keyword}: SearchProfiles){
        const response = await this.searchApi.getProfilesByKeyword(keyword);

        if(response == null || response == undefined){
            return;
        }

        ctx.setState({
            SearchProfilesForm: {
                model: {
                    profiles: response
                }
            }
        })
    }

    @Action(SearchCommunities)
    async searchCommunities(ctx: StateContext<SearchCommunitiesModel>, {keyword}: SearchCommunities){
        const response = await this.searchApi.getCommunitiesByKeyword(keyword);

        if(response == null || response == undefined){
            return;
        }

        ctx.setState({
            SearchCommunitiesForm: {
                model: {
                    communities: response
                }
            }
        })
    }

    @Selector()
    static getAllProfiles(state: getAllProfilesModel){
        return state.GetAllProfilesForm.model.profiles;
    }

    @Selector()
    static getAllCommunities(state: GetAllCommunitiesModel){
        return state.GetAllCommunitiesForm.model.communities;
    }

    @Selector()
    static searchPostsByCategory(state: SearchPostsByCategoryModel){
        return state.SearchPostsForm.model.posts;
    }

    @Selector()
    static searchPosts(state: SearchModel){
        return state.SearchPostsForm.model.posts;
    }

    @Selector()
    static searchProfiles(state: SearchProfilesModel){
        return state.SearchProfilesForm.model.profiles;
    }

    @Selector()
    static searchCommunities(state: SearchCommunitiesModel){
        return state.SearchCommunitiesForm.model.communities;
    }

}
