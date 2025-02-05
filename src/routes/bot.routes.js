import express from 'express';
import {createBotController, deleteBotController, listBotsController} from "../controllers/bot.controller.js";
import {checkSchema} from "express-validator";
import {createBotSchema} from "../utils/validation-schema.js";
import {handleValidationError} from "../middlewares/validation.middleware.js";

const router = express.Router();

router.get("/", listBotsController);
router.post("/", checkSchema(createBotSchema), handleValidationError, createBotController);
router.delete("/", deleteBotController);
// router.delete("/token", resetBotTokenController);

export default router;