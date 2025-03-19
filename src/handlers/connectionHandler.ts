import {
    DisconnectReason,
    MessageUpsertType,
    WAMessage,
    WASocket,
} from "@whiskeysockets/baileys";
import { CommandHandler } from "./commandHandler";
import qrcode from "qrcode-terminal";
import log from "../utils/logger";
import { GroupHandler } from "./groupHandler";

export function handleConnection(sock: WASocket, startBot: () => void) {
    const commandHandler = new CommandHandler();
    const groupHandler = new GroupHandler();
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
            // console.log(m);
            commandHandler.messageHandler(m, sock);
        },
    );

    sock.ev.on("group-participants.update", (log) => {
        groupHandler.joinhandler(log, sock);
    });
}
