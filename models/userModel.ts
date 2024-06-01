import { model, Schema } from 'mongoose';

interface User {
    username: string;
    nickname: string;
    password: string;
}

const userSchema = new Schema<User>({
    username: { type: String, required: true, unique: true },
    nickname: { type: String, required: true },
    password: { type: String, required: true },
}, {
    timestamps: true
});

const UserModel = model<User>('User', userSchema);

export default UserModel;

