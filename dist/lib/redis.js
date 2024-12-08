"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("@upstash/redis");
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const redisClient = new redis_1.Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_KEY,
});
exports.default = redisClient;
