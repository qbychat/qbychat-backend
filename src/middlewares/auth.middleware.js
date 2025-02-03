import express from "express";
import {isValidToken, parseToken} from "../utils/auth.utils.js";
import debug from "debug";
import User from "../models/user.model.js";

const ANONYMOUS_PATH = [
    "/api/user/login",
    "/api/user/register"
]

const log = debug('qbychat:security')

/**
 * A simple logger to record every requests
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * */
export async function securityMatchers(req, res, next) {
    if (req.path in ANONYMOUS_PATH) {
        // anonymous
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