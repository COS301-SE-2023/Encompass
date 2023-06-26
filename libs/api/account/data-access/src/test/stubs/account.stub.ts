import mongoose from "mongoose"

export const accountStub = () =>{
    return {
        _id: new mongoose.Types.ObjectId('abc123456789123456789012'),
        email: 'test@integration.com',
        password: 'testing12345',
    }
}