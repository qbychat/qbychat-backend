import {validationResult} from "express-validator";
import {RestBean} from "../entities/vo.entities.js";

export function handleValidationError(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send(RestBean.fromErrorArray(result.array()));
    } else {
        next();
    }
}