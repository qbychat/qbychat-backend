import mongoose from 'mongoose';

export const Platforms = Object.freeze({
    UNKNOWN: 0,
    WEB: 1,
    ANDROID: 2,
    IOS: 3,
    LINUX: 4,
    WINDOWS: 5,
    MACOS: 6,
    BOT: 7 // qbychat bots
});

export const SessionStatus = Object.freeze({
    VALID: 0,
    MFA: 1,
    EXPIRED: 2
});

const SessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: String,
    platform: {
        type: Number,
        enum: Object.values(Platforms),
        required: true,
    },
    status: {
        type: Number,
        enum: Object.values(SessionStatus),
        required: true,
    }
}, { timestamps: true });

const Session = mongoose.model("Session", SessionSchema);

export default Session;