import User, {UserRoles} from "../models/user.model.js";
import {
    findAllSessions,
    generateAccessToken,
    resolveLocation,
    resolvePlatform,
    tokenResponse
} from "../utils/auth.utils.js";
import debug from "debug";
import Session, {SessionStatus} from "../models/session.model.js";
import {RestBean} from "../entities/vo.entities.js";
import moment from "moment";
import {comparePassword, hashPassword} from "../utils/crypt.utils.js";

const log = debug('qbychat:controllers:user');

/**
 * Login
 *
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
    res.send(RestBean.success(tokenResponse(token, session, user)));
}

/**
 * Register a qbychat account
 *
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
        roles: [
            UserRoles.USER
        ]
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
 * Renew the token
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * */
export async function refreshController(req, res) {
    const user = req.user;
    // regenerate token with session
    const session = req.session;
    const token = generateAccessToken(session);
    log(`User ${user.username} regenerated it's token.`)
    res.send(RestBean.success(tokenResponse(token, session, session.user)))
}

/**
 * Terminate a session
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * */
export async function logoutController(req, res) {
    const {session: anotherSessionId} = req.body;
    const currentSession = req.session;
    let targetSession = currentSession;
    if (anotherSessionId && anotherSessionId !== currentSession.id) {
        const currentSessionCreateAt = moment(currentSession.createdAt);
        const canTerminateOtherSessions = moment().diff(currentSessionCreateAt, "hours") >= 4
        if (!canTerminateOtherSessions) {
            return res.status(403).send(RestBean.error(403, 'Your session needs to last at least four hours before you can end other sessions.'));
        }
        // This user wants to end the session logged in from other clients
        // find session
        targetSession = await Session.findById(anotherSessionId)
            .populate('user');
        if (!targetSession) {
            return res.status(401).send(RestBean.error(400, 'Session not found'));
        }
        if (targetSession.user.id !== currentSession.user.id) {
            // This is someone else's session
            return res.status(403).send(RestBean.error(403, 'You have no permission to terminate this session.'));
        }
    }
    log(`Session ${targetSession.id} was terminated. (User ${targetSession.user.username})`);
    // delete session
    await targetSession.deleteOne();
    res.send(RestBean.success());
}

/**
 * Get all sessions
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * */
export async function sessionsController(req, res) {
    const sessions = await findAllSessions(req.user);
    const currentSession = req.session;
    res.send(RestBean.success(sessions
        .filter(session => session.status === SessionStatus.VALID)
        .map((session) => {
        return {
            id: session.id,
            location: session.location,
            platform: session.platform,
            timestamp: session.createAt,
            current: session.id === currentSession.id
        }
    })));
}
