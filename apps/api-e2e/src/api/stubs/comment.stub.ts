import mongoose from "mongoose";

export const commentStub = () =>{
    return {
        _id: new mongoose.Types.ObjectId('abc123456789123456789010'),
        postId: 'reply_id_1',
        username: 'jane_smith',
        text: 'Comment',
        profileImage: 'profile_image'
    }
}