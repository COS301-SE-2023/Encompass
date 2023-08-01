import mongoose from "mongoose";

export const commentDtoStub = () =>{
    return {
        _id: new mongoose.Types.ObjectId('abc123456789123456789010'),
        postId: "post_id",
        username: "john_doe",
        text: "Comment text",
        replies: [],
        dateAdded: new Date(),
        profileImage: "profile_image"
    }
}