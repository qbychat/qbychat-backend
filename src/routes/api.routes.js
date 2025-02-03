import express from 'express';
import userRouter from "./user.routes.js";

const router = express.Router();

router.use('/user', userRouter);

router.use('/test', (req, res) => {
    res.send('test');
})

export default router;