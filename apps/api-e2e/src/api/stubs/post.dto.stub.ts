import mongoose from "mongoose";

export const PostDtoStub = () => {
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
        dateAdded: "2023-08-11", 
        spoiler: false,
        ageRestricted: false,
        shares: 0, 
        comments: 0,
        reported: false,
        isPrivate: false,
    };
}