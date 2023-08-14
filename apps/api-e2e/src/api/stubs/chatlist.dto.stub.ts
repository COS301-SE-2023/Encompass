import mongoose from "mongoose";

export const chatListDtoStub = () =>{
    const uniqueId = new mongoose.Types.ObjectId();

    return {
        //_id: uniqueId,
        username: "test-user1",
        chatList: [
            {
                chatRef: 'test',
                otherUser: "test-user-2",
            }
        ]
    }
}