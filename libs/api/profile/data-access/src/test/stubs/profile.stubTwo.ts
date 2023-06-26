import mongoose from "mongoose";

export const profileStubTwo = () =>{
    return {
        _id: new mongoose.Types.ObjectId('abc123456789123456789012'),
        username: 'testTwo',
        name: 'testTwo',
        lastName: 'testTwo',
        categories: ['testTwo'],
        communities: ['testTwo'],
        awards: ['testTwo'],
        events: ['testTwo'],
        followers: ['testTwo'],
        following: ['testTwo'],
        posts: ['testTwo'],
        reviews: ['testTwo'],
    }
}