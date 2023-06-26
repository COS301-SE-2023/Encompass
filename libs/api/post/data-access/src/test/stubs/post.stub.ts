import mongoose from "mongoose";

export const postStub = () =>{
    return {
        _id: new mongoose.Types.ObjectId('abc123456789123456789024'),
        community: "example_community",
        title: "Example Title",
        text: "Example Text",
        username: "example_user",
        imageUrl: null,
        communityImageUrl: null,
        categories: ["category1", "category2"],
        likes: [],
        spoiler: false,
        ageRestricted: false,
    }
}