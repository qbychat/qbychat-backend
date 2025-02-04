import User from "../models/user.model.js";
import {
    comparePassword,
    generateAccessToken,
    hashPassword,
    parseToken,
    resolveLocation,
    resolvePlatform
} from "../utils/auth.utils.js";
import debug from "debug";
import Session, {SessionStatus} from "../models/session.model.js";

const log = debug('qbychat:controllers:user');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * */
export async function loginController(req, res) {
    const {username, password} = req.body
    // compare with database
    const user = await User.findOne({username: username});
    if (!user || !await comparePassword(password, user.password)) {
        return res.status(401).send({
            code: 401,
            message: 'Invalid username or password',
            data: null
        })
    }
    // generate jwt
    // create session object
    const session = await Session.create({
        user: user.id,
        location: resolveLocation(req),
        platform: resolvePlatform(req.header("User-Agent")),
        status: SessionStatus.VALID // todo MFA
    })
    const token = generateAccessToken(session);
    log(`User ${user.username} logged in`);
    // decode token
    const decodedToken = parseToken(token);
    res.send({
        code: 200,
        data: {
            token: token,
            user: {
                id: user.id,
                username: user.username,
            },
            session: {
                id: session.id,
                location: session.location
            },
            expire: decodedToken.exp
        },
        message: 'Success'
    });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * */
export async function registerController(req, res) {
    const {username, password} = req.body
    if (await User.findOne({username: username})) {
        return res.status(409).send({
            code: 409,
            message: 'User already exists',
            data: null
        })
    }
    const user = await User.create({
        username: username,
        password: await hashPassword(password),
        nickname: username,
        bio: null,
        roles: ['user']
    })
    log(`User ${user.username} was registered.`)
    return res.status(201).send({
        code: 201,
        message: 'Success',
        data: {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            bio: user.bio,
            roles: user.roles
        }
    })
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * */
export async function refreshController(req, res) {
    const user = req.user;
    // regenerate token with session
    const session = req.session;
    const token = generateAccessToken(session);
    log(`User ${user.username} regenerated it's token.`)
    res.send({
        code: 200,
        data: {
            token: token,
            id: user.id,
            username: user.username
        },
        message: 'Success'
    });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * */
export function logoutController(req, res) {

}