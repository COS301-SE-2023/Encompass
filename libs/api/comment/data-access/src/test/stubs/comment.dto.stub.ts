import mongoose from "mongoose";

export const commentDtoStub = () =>{
    return {
        _id: new mongoose.Types.ObjectId('abc123456789123456789012'),
        postId: "post_id",
        username: "john_doe",
        text: "Comment text",
        replies: [
        {
            id: "reply_id_1",
            username: "jane_smith",
            text: "Reply 1 text",
            dateAdded: new Date(),
        },
        {
            id: "reply_id_2",
            username: "bob_johnson",
            text: "Reply 2 text",
            dateAdded: new Date(),
        },
        ],
        dateAdded: new Date(),
    }
}