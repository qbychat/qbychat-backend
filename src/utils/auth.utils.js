import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import geoip from "geoip-lite";
import {Platforms} from "../models/session.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generate a JWT
 *
 * */
export function generateAccessToken(session) {
    return jwt.sign({
        session: session.id
    }, JWT_SECRET, { expiresIn: 7 * 24 * 60 * 60 });
}

/**
 * Encrypt a password
 *
 * @param {String} rawPassword
 * */
export async function hashPassword(rawPassword) {
    const saltRounds = 13;
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
    if (!usedProxy) {
        return geoip.lookup(req.ip);
    } else {
        const ip = req.header('X-Real-IP');
        return geoip.lookup(req.ip);
    }
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
