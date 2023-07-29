import { Injectable } from "@angular/core"
import { CommunityDto } from "@encompass/api/community/data-access"
import { PostDto } from "@encompass/api/post/data-access"
import { ProfileDto } from "@encompass/api/profile/data-access"
import { Action, Selector, State, StateContext } from "@ngxs/store"
import { SearchApi } from "./search.api"
import { SearchCommunities, SearchPosts, SearchProfiles } from "@encompass/app/search-explore/util"

export interface SearchModel{
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

@Injectable()
export class SearchState{
    constructor(private searchApi: SearchApi){}

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
    static getPosts(state: SearchModel){
        return state.SearchPostsForm.model.posts;
    }

    @Selector()
    static getProfiles(state: SearchProfilesModel){
        return state.SearchProfilesForm.model.profiles;
    }

    @Selector()
    static getCommunities(state: SearchCommunitiesModel){
        return state.SearchCommunitiesForm.model.communities;
    }

}
