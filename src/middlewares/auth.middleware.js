import {comparePassword, isValidToken, parseToken} from "../utils/auth.utils.js";
import debug from "debug";
import User from "../models/user.model.js";

const ANONYMOUS_PATH = [
    "/api/user/login",
    "/api/user/register"
]

const log = debug('qbychat:security')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * */
export async function authBots(req, res, next) {
    const botToken = req.header('X-Bot-Token');
    if (!botToken) {
        return next(); // not a bot
    }
    // decode token
    try {
        // decode base64
        const decodedToken = Buffer.from(botToken, 'base64').toString('utf-8');
        const tokenData = JSON.parse(decodedToken);
        const {id, token} = tokenData
        // find user
        const user = await User.findById(id);
        if (!user || !user.bot) {
            return res.status(401).send({
                code: 401,
                message: 'Bot does not exist',
                data: null
            });
        }
        // compare token
        if (!await comparePassword(token, user.password)) {
            return res.status(401).send({
                code: 401,
                message: 'Bad token',
                data: null
            });
        }
        // valid token
        req.user = user;
        next();
    } catch (err) {
        res.send(401).send({
            code: 401,
            message: 'Failed to decode bot token',
            data: null
        })
    }
}

/**
 * A simple logger to record every requests
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * */
export async function auth(req, res, next) {
    if (req.path in ANONYMOUS_PATH || req.user !== null) {
        // anonymous or already authed
        return next();
    }
    // resolve token
    const token = req.header("Authorization");
    if (token === null || !isValidToken(token)) {
        return res.status(401).send({
            code: 401,
            data: null,
            message: "Unauthorized"
        })
    }
    // put the user object to req
    const parsedToken = parseToken(token);
    req.user = await User.findById(parsedToken.id);
    next(); // continue
}