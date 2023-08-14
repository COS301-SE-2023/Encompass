export const chatDtoStub = () =>{
    //const uniqueId = new mongoose.Types.ObjectId();

    return {
        users: ['User1', 'User2'],
        messages: [
            {
                username: 'User1',
                message: 'Hello!',
            },
        ],
    };
};