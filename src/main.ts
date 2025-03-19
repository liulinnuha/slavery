import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
// import qrcode from "qrcode-terminal";
import dotenv from "dotenv";
import pino from "pino";
import { handleConnection } from "./handlers/connectionHandler";
import { SESSION_FILE, MONGODB_URI } from "./config/env";
import { connectDB } from "@utils/mongodb";

dotenv.config();
connectDB(MONGODB_URI);

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_FILE);
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // Set false karena kita pakai qrcode-terminal
        logger: pino({ level: "silent" }),
    });
    handleConnection(sock, startBot);

    sock.ev.on("creds.update", saveCreds);
}

startBot();
