import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;

export function generateAccessToken(userId) {
    return jwt.sign({
        id: userId,
    }, JWT_SECRET, { expiresIn: 7 * 24 * 60 * 60 });
}

export async function hashPassword(rawPassword) {
    const saltRounds = 13;
    return await bcrypt.hash(rawPassword, saltRounds);
}

/**
 * @return {Promise<boolean>}
 * */
export async function comparePassword(rawPassword, encodedPassword) {
    return await bcrypt.compare(rawPassword, encodedPassword);
}

/**
 * @param {String} token
 * */
export function isValidToken(token) {
    if (!token) {
        return false;
    }
    if (token.startsWith("Bearer ")) {
        // cur Bearer
        token = token.slice(7);
    }
    return jwt.verify(token, JWT_SECRET);
}

export function parseToken(token) {
    if (token.startsWith("Bearer ")) {
        // cur Bearer
        token = token.slice(7);
    }
    return jwt.decode(token, JWT_SECRET);
}