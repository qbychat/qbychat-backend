import debug from "debug";
import User, {UserRoles} from "../models/user.model.js";
import mongoose from "mongoose";
import {RestBean} from "../entities/vo.entities.js";
import {generateBotToken, hashPassword} from "../utils/crypt.utils.js";

const log = debug('qbychat:controllers:bot');

/**
 * List bots
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * */
export async function listBotsController(req, res) {
    const user = req.user;
    if (user.bot) {
        // this user is a bot
        return res.status(418).send(RestBean.error(418, 'Bots cannot create bots'));
    }
    // find all bots by bot owner
    /**
     * @type {[User]}
     * */
    const bots = await User.find({ botOwner: new mongoose.Types.ObjectId(user.id) });
    return res.send(RestBean.success(bots.map(bot => {
        return {
            id: bot.id,
            username: bot.username,
            nickname: bot.nickname,
            bio: bot.bio,
            createAt: bot.createAt,
        }
    })));
}

/**
 * Create a bot
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * */
export async function createBotController(req, res) {
    const { username } = req.body;
    const user = req.user;
    // check the username is available
    if (await User.exists({username: username})) {
        return res.status(409).send(RestBean.error(409, 'Username was taken'));
    }
    // create the bot user
    const botToken = await generateBotToken();
    const bot = await User.create({
        username: username,
        password: await hashPassword(botToken),
        nickname: username,
        bio: null,
        roles: [
            UserRoles.BOT
        ],

        bot: true,
        botOwner: user.id
    });

    const tokenJson = {
        id: bot.id,
        token: botToken
    }

    const tokenString = btoa(JSON.stringify(tokenJson));
    res.status(200).send(RestBean.success({
        id: bot.id,
        username: username,
        token: tokenString
    }));
}

export async function deleteBotController() {

}