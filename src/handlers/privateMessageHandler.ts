import { WASocket, proto } from "@whiskeysockets/baileys";
import log from "../utils/log";

export async function handlePrivateMessage(
    sock: WASocket,
    message: proto.IWebMessageInfo,
) {
    const sender = message.key.remoteJid!;
    const text = message.message?.conversation?.toLowerCase() || "";

    log.debug(`📩 Private Chat: ${sender} - Pesan: ${text}`);
}
