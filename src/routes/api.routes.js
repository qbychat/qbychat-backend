import express from 'express';
import authRoutes from "./auth.routes.js";
import botRoutes from "./bot.routes.js";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/bot', botRoutes);

router.use('/test', (req, res) => {
    res.send('test');
})

export default router;