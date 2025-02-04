import express from "express";
import debug from "debug";

const log = debug('qbychat:http');

/**
 * A simple logger to record every requests
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {express.NextFunction} next
 * */
export const requestLogger = (req, res, next) => {
    log(`[${req.method.toUpperCase()}] ${req.path}`);
    next();
}