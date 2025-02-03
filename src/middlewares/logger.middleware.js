import express from "express";
import debug from "debug";

const log = debug('qbychat:http');

/**
 * A simple logger to record every requests
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * */
export const requestLogger = (req, res, next) => {
    log(`[${req.method.toUpperCase()}] ${req.protocol}://${req.hostname}${req.path}`);
    next();
}