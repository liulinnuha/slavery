import { WASocket } from "@whiskeysockets/baileys";
import log from "../utils/log";
import { handleGroupMessage } from "./groupMessageHandler";
import { handlePrivateMessage } from "./privateMessageHandler";

export function handleMessage(sock: WASocket) {
    sock.ev.on("messages.upsert", async (m) => {
        const message = m.messages[0];
        if (!message.message || message.key.fromMe) return;

        const sender = message.key.remoteJid!;
        const isGroup = sender.endsWith("@g.us");

        if (isGroup) {
            log.info(`📢 Pesan dari Grup: ${sender}`);
            handleGroupMessage(sock, message);
        } else {
            log.info(`📩 Pesan dari Private Chat: ${sender}`);
            handlePrivateMessage(sock, message);
        }
    });
}
