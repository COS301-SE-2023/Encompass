import mongoose from "mongoose";

export const userProfileStub = ({
    customUsername = "Test-name",
    customId = new mongoose.Types.ObjectId('abc123456789123456789012'),
} = {}) =>{

    return {
        _id: `${customId}`,
        username: `${customUsername}`,
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