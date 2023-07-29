import { CommunityDto } from "@encompass/api/community/data-access"
import { PostDto } from "@encompass/api/post/data-access"
import { ProfileDto } from "@encompass/api/profile/data-access"
import { State } from "@ngxs/store"

export interface SearchModel{
    SearchPostsForm: {
        model: {
            posts: PostDto[] | null
        }
    }
}

export interface SearchProfilesModel{
    SearchProfilesForm: {
        model: {
            profiles: ProfileDto[] | null
        }
    }
}

export interface SearchCommunitiesModel{
    SearchCommunitiesForm: {
        model: {
            communities: CommunityDto[] | null
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
    async searchPosts(ctx: StateContext<SearchModel>, action: SearchPosts){
