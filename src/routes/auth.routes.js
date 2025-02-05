import express from 'express';
import {
    loginController,
    logoutController,
    refreshController,
    registerController, resetPasswordController, sessionsController
} from "../controllers/auth.controller.js";
import {checkSchema} from "express-validator";
import {loginSchema, logoutSchema, registerSchema, resetPasswordSchema} from "../utils/validation-schema.js";
import {handleValidationError} from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/login", checkSchema(loginSchema), handleValidationError, loginController);
router.post("/register", checkSchema(registerSchema), handleValidationError, registerController);
router.post("/refresh", refreshController);
router.post("/logout", checkSchema(logoutSchema), handleValidationError, logoutController);
router.get("/sessions", sessionsController);
router.patch("/password", checkSchema(resetPasswordSchema), handleValidationError, resetPasswordController);

export default router;