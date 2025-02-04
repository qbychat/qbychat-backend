import mongoose from 'mongoose';

export const UserRoles = Object.freeze({
    USER: 0,
    ADMIN: 1,
    BOT: 2
})

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,

    nickname: String,
    bio: String,
    roles: [{type: Number, enum: UserRoles, required: true}],

    bot: Boolean,
    botOwner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: false}
    // todo settings
}, {timestamps: true});

const User = mongoose.model("User", UserSchema);

export default User;