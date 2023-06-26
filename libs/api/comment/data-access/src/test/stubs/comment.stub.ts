import mongoose from "mongoose";

export const commentStub = () =>{
    return {
        _id: new mongoose.Types.ObjectId('abc123456789123456789012'),
        postId: 'reply_id_1',
        username: 'jane_smith',
        text: 'Reply 1 text'
    }
}