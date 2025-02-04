import {isValidToken, parseToken} from "../utils/auth.utils.js";
import debug from "debug";
import User from "../models/user.model.js";
import Session, {SessionStatus} from "../models/session.model.js";
import {RestBean} from "../entities/vo.entities.js";
import {comparePassword} from "../utils/crypt.utils.js";

const ANONYMOUS_PATH = [
    "/api/auth/login",
    "/api/auth/register"
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
        const decodedToken = atob(botToken);
        const tokenData = JSON.parse(decodedToken);
        const {id, token} = tokenData
        // find user
        const user = await User.findById(id);
        if (!user || !user.bot) {
            return res.status(401).send(RestBean.error(401, 'Bot does not exist'));
        }
        // compare token
        if (!await comparePassword(token, user.password)) {
            return res.status(401).send(RestBean.error(401, 'Bad token'));
        }
        if (req.path.startsWith("/api/auth")) {
            return res.status(400).send(RestBean.error(400, 'Bots should not use this API'));
        }
        // valid token
        req.user = user;
        next();
    } catch (err) {
        res.send(401).send(RestBean.error(401, 'Failed to decode bot token'))
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
    if (ANONYMOUS_PATH.includes(req.path) || req.user) {
        // anonymous or already authed
        return next();
    }
    // resolve token
    const token = req.header("Authorization");
    if (token === null || !isValidToken(token)) {
        return res.status(401).send(RestBean.error(401, 'Unauthorized'));
    }
    // put the user object to req
    const parsedToken = parseToken(token);
    const session = await Session.findById(parsedToken.session)
        .populate('user');
    if (!session || session.status !== SessionStatus.VALID) {
        return res.status(401).send(RestBean.error(401, 'Session expired'));
    }
    req.user = session.user;
    req.session = session;
    next(); // continue
}