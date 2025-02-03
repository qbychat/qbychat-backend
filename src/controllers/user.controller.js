import express from 'express';
import User from "../models/user.model.js";
import {comparePassword, generateAccessToken, hashPassword} from "../utils/auth.utils.js";
import debug from "debug";

const log = debug('qbychat:controllers:user');

/**
 * @param {express.Request} req
 * @param {express.Response} res
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
    const token = generateAccessToken(user.id)
    log(`User ${user.username} logged in`)
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
 * @param {express.Request} req
 * @param {express.Response} res
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

export async function refreshController(req, res) {
    // generate a new jwt key
    const user = req.user;
    // regenerate token
}