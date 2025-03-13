import * as dotenv from "dotenv";
dotenv.config();

export const SESSION_FILE = process.env.SESSION_FILE || "session";
export const BOTNAME = process.env.BOT_NAME || "SlaveryBot";
export const PREFIX = process.env.BOT_PREFIX || "!";
export const OWNER = process.env.BOT_OWNER || "liulinnuha";
