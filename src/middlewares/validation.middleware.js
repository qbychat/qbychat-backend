import {validationResult} from "express-validator";

export function handleValidationError(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send({
            code: 400,
            errors: result.array(),
            message: 'Bad Request',
            data: null
        });
    } else {
        next();
    }
}