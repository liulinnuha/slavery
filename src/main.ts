import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
// import qrcode from "qrcode-terminal";
import dotenv from "dotenv";
import pino from "pino";
import { handleConnection } from "./handlers/connectionHandler";
import { SESSION_FILE } from "./config/env";

dotenv.config();

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_FILE);
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // Set false karena kita pakai qrcode-terminal
        logger: pino({ level: "silent" }),
    });
    handleConnection(sock, startBot);

    sock.ev.on("creds.update", saveCreds);

    // sock.ev.on("messages.upsert", (msg) => {
    //     console.log("Received a new message:", msg);
    // });
}

startBot();
