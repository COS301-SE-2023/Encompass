import mongoose from "mongoose";

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