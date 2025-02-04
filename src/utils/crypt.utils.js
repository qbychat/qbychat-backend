import crypto from 'crypto';
import bcrypt from "bcryptjs";

export async function generateBotToken() {
    return crypto.randomUUID();
}

/**
 * Encrypt a password
 *
 * @param {String} rawPassword
 * */
export async function hashPassword(rawPassword) {
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    return await bcrypt.hash(rawPassword, saltRounds);
}

/**
 * Compare passwords
 *
 * @param {String} rawPassword
 * @param {String} encodedPassword
 * @return {Promise<boolean>}
 * */
export async function comparePassword(rawPassword, encodedPassword) {
    return await bcrypt.compare(rawPassword, encodedPassword);
}