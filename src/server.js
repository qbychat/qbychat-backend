import 'dotenv/config.js';
import express from "express";
import {createServer} from "http";
import compression from 'compression';
import { Server as SocketServer } from 'socket.io';
import apiRouter from "./routes/api.routes.js";
import debug from "debug";
import {connectToDB} from "./utils/db.js";
import {requestLogger} from "./middlewares/logger.middleware.js";
import {securityMatchers} from "./middlewares/auth.middleware.js";

const log = debug("qbychat:server");

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(compression());
app.use(requestLogger);
app.use(securityMatchers)
// routes
app.use("/api", apiRouter);

// socket.io server
const io = new SocketServer(httpServer, {
    cors: {
        origin: process.env.FRONTEND_ORIGIN || '*',
    }
});

io.on('connection', (socket) => {
    socket.on('message', (data) => {
        log(data);
    });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, async () => {
    log(`Server listening on port ${PORT}`);
    // connect to MongoDB
    await connectToDB();
});
