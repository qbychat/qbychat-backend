import crypto from 'crypto';

export async function generateBotToken() {
    await crypto.randomBytes(32)
}