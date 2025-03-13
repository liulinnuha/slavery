import {
    DisconnectReason,
    MessageUpsertType,
    WAMessage,
    WASocket,
} from "@whiskeysockets/baileys";
import { CommandHandler } from "./commandHandler";
import qrcode from "qrcode-terminal";
import log from "../utils/logger";

export function handleConnection(sock: WASocket, startBot: () => void) {
    const commandHandler = new CommandHandler();
    commandHandler.registerCommand();
    sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            qrcode.generate(qr, { small: true });
        }
        if (connection === "close") {
            const ShouldReconnect =
                (lastDisconnect?.error as any)?.output?.statusCode !==
                DisconnectReason.loggedOut;
            log.warn("⚠️ Connection closed, reconnecting..");
            if (ShouldReconnect) {
                startBot();
            }
        } else if (connection === "open") {
            log.info("✅ Bot connected!");
        }
    });

    sock.ev.on(
        "messages.upsert",
        (m: { messages: WAMessage[]; type: MessageUpsertType }) => {
            commandHandler.messageHandler(m, sock);
        },
    );
}
