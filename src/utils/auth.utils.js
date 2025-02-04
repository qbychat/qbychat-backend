import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import geoip from "geoip-lite";
import Session, {Platforms} from "../models/session.model.js";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generate a JWT
 *
 * */
export function generateAccessToken(session) {
    return jwt.sign({
        session: session.id
    }, JWT_SECRET, {expiresIn: 7 * 24 * 60 * 60});
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

/**
 * Verify a token valid
 *
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

/**
 * Parse a jwt token
 * @param {String} token
 * */
export function parseToken(token) {
    if (token.startsWith("Bearer ")) {
        // cur Bearer
        token = token.slice(7);
    }
    return jwt.decode(token, JWT_SECRET);
}

/**
 * Parse location from IP address
 *
 * @param {import('express').Request} req
 * */
export function resolveLocation(req) {
    const usedProxy = process.env.RELAY === 'true';
    let ip;
    if (!usedProxy) {
        ip = req.ip;
    } else {
        ip = req.header('X-Real-IP');
    }
    const location = geoip.lookup(ip);
    if (!location) {
        return "Internal Address";
    }
    if (!location.city) {
        return location.country;
    }
    return `${location.country}, ${location.city}`
}

export function resolvePlatform(userAgent) {
    if (!userAgent) {
        return Platforms.UNKNOWN;
    }

    userAgent = userAgent.toLowerCase();

    if (userAgent.includes("android")) {
        return Platforms.ANDROID;
    } else if (userAgent.includes("iphone") || userAgent.includes("ipod") || userAgent.includes("ipad")) {
        return Platforms.IOS;
    } else if (userAgent.includes("windows nt")) {
        return Platforms.WINDOWS;
    } else if (userAgent.includes("mac os x")) {
        return Platforms.MACOS;
    } else if (userAgent.includes("linux")) {
        return Platforms.LINUX;
    } else {
        return Platforms.UNKNOWN;
    }
}

export function tokenResponse(token, session, user) {
    const decodedToken = parseToken(token);
    return {
        token: token,
        user: {
            id: user.id,
            username: session.user.username,
        },
        session: {
            id: session.id,
            location: session.location
        },
        expire: decodedToken.exp
    }
}

/**
 * @return {Promise<[Session]>} sessions list
 * */
export async function findAllSessions(user) {
    return Session.find({user: new mongoose.Types.ObjectId(user.id)});
}