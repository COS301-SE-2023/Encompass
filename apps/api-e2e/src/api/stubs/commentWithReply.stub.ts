import mongoose from "mongoose";

export const commentWithReplyStub = () =>{
    return {
        _id: new mongoose.Types.ObjectId('abc123456789123456789010'),
        postId: "post_id",
        username: "john_doe",
        text: "Comment text",
        replies: [
            {
                id: "abc123456789123456789015",
                username: "Sizwe_Nkosi",
                text: "Reply 1 text",
                dateAdded: new Date()
            }
        ],
        dateAdded: new Date(),
    }
}