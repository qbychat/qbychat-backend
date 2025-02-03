import mongoose from 'mongoose';
import debug from "debug";

const log = debug('qbychat:db');

export async function connectToDB() {
    log(`Connecting to MongoDB...`);
    await mongoose.connect(process.env.MONGODB_URI);
    log(`Database connected.`);
}