import { UpdateProfileRequest } from "../../data-access/src/dto"
import { Profile } from "../../data-access/src/profile"
import { ProfileDto } from "../../data-access/src/profile.dto"
import mongoose, { ObjectId } from "mongoose";

export const profileStub = () =>{
    return {
        _id: new mongoose.Types.ObjectId('abc123456789123456789012'),
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