import mongoose from "mongoose";

export const postStub = () =>{
    return {
        _id: new mongoose.Types.ObjectId('abc123456789123456789029'),
        community: "Adventure_Seekers_test",
        title: "Example Title",
        text: "Example Text",
        username: "example_user",
        imageUrl: null,
        communityImageUrl: null,
        categories: ["category1", "category2"],
        likes: [],
        //dateAdded: "", 
        spoiler: false,
        ageRestricted: false,
        //shares: 0, 
        //comments: 0,
        //reported: false,
        //isPrivate: false,
    }
}