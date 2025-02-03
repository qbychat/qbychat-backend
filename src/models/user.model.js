import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,

    nickname: String,
    bio: String,
    roles: [{ type: String }]
    // todo settings
});

const User = mongoose.model("User", UserSchema);

export default User;