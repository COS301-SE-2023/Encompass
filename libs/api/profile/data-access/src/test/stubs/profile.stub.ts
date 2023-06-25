import { UpdateProfileRequest } from "../../dto"

export const profileStub = (): UpdateProfileRequest => {
    return {
        username: 'test',
        name: 'test',
        lastName: 'test',
        categories: ['test'],
        communities: ['test'],
        awards: ['test'],
        events: ['test'],
        followers: ['test'],
        following: ['test'],
        posts: ['test'],
        reviews: ['test'],
    }
}