import { WASocket, proto } from "@whiskeysockets/baileys";
import log from "../utils/log";

export async function handleGroupMessage(
    sock: WASocket,
    message: proto.IWebMessageInfo,
) {
    const sender = message.key.remoteJid!;
    const text = message.message?.conversation || "";

    log.debug(`📢 Grup: ${sender} - Pesan: ${text}`);
}
