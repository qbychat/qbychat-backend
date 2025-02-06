import express from 'express';
import {
    createBotController,
    deleteBotController,
    listBotsController,
    resetBotTokenController
} from "../controllers/bot.controller.js";
import {checkSchema} from "express-validator";
import {createBotSchema, deleteBotSchema} from "../utils/validation-schema.js";
import {handleValidationError} from "../middlewares/validation.middleware.js";

const router = express.Router();

router.get("/", listBotsController);
router.post("/", checkSchema(createBotSchema), handleValidationError, createBotController);
router.delete("/", checkSchema(deleteBotSchema), deleteBotController);
router.post("/token", resetBotTokenController);

export default router;