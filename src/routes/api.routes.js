import express from 'express';
import authRouter from "./auth.routes.js";

const router = express.Router();

router.use('/auth', authRouter);

router.use('/test', (req, res) => {
    res.send('test');
})

export default router;