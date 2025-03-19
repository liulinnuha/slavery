import * as dotenv from "dotenv";
dotenv.config();

export const SESSION_FILE = process.env.SESSION_FILE || "session";
export const BOTNAME = process.env.BOT_NAME || "Slavery";
export const PREFIX = process.env.BOT_PREFIX || "!";
export const OWNER = process.env.BOT_OWNER || "liulinnuha";
export const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/slavery";
