import { MessageQuote, MessageSerialize } from "@constants";
import { WAMessage, WASocket, proto } from "@whiskeysockets/baileys";
import log from "./logger";

export const serialize = async (
    msg: WAMessage,
    client: WASocket,
): Promise<MessageSerialize> => {
    const m = {} as MessageSerialize;
    if (msg.key) {
        m.id = msg.key.id ?? undefined;
        m.isSelf = msg.key.fromMe ?? undefined;
        m.myId = client.user?.id?.split(":")[0] + "@s.whatsapp.net";
        m.from = msg.key.remoteJid ?? undefined;
        m.isGroup = (m.from ?? "").endsWith("@g.us");
        m.pushName = msg.pushName || "";
        m.sender = m.isGroup ? (msg.key.participant ?? m.from) : m.from;
        m.sender = (m.sender ?? "").includes(":")
            ? (m.sender ?? "").split(":")[0] + "@s.whatsapp.net"
            : m.sender;
        m.senderNumber = (m.sender ?? "").split("@")[0];
    }

    // Determine message type (excluding messageContextInfo)
    m.type = Object.keys(msg.message || {}).filter(
        (msgType) => msgType !== "messageContextInfo",
    )[0];

    // Handle ephemeral and viewOnce messages
    if (["ephemeralMessage", "viewOnceMessage"].includes(m.type)) {
        m.type = Object.keys(msg.message || {}).filter(
            (msgType) => msgType !== "messageContextInfo",
        )[0];
    }

    // Body of the message
    m.body =
        msg.message?.conversation || // Pesan teks biasa
        msg.message?.extendedTextMessage?.text || // Pesan teks dengan format khusus
        (msg.message as any)?.[m.type]?.text || // Type assertion untuk pesan umum
        (msg.message as any)?.[m.type]?.caption || // Caption dalam gambar/video
        (m.type === "listResponseMessage" &&
            (msg.message as any)?.[m.type]?.singleSelectReply?.selectedRowId) || // Jawaban dari list message
        (m.type === "buttonsResponseMessage" &&
            (msg.message as any)?.[m.type]?.selectedButtonId) || // Jawaban dari button message
        (m.type === "templateButtonReplyMessage" &&
            (msg.message as any)?.[m.type]?.selectedId) || // Jawaban dari template button
        "";

    // Mentions handling
    m.mentions =
        (msg.message as any)?.[m.type]?.contextInfo?.mentionedJid || [];

    // Handle quoted messages
    // Handle quoted messages
    let quotedMsg: MessageQuote | undefined;

    const contextInfo = (msg.message as any)?.[m.type]?.contextInfo;
    if (contextInfo?.quotedMessage) {
        quotedMsg = {} as MessageQuote;
        quotedMsg.message = contextInfo.quotedMessage;

        quotedMsg.key = {
            id: contextInfo.stanzaId ?? "", // Pastikan tidak undefined
            fromMe:
                contextInfo.participant ===
                client.user?.id.split(":")[0] + "@s.whatsapp.net",
            remoteJid: m.from ?? "",
        };

        quotedMsg.delete = async () => {
            if (!m.from || !quotedMsg?.key?.id) {
                throw new Error("Quoted message key or from is missing");
            }

            const response = await client.sendMessage(m.from, {
                delete: quotedMsg.key,
            });

            if (!response) {
                throw new Error("Failed to delete quoted message");
            }

            return response;
        };
    }

    m.quoted = quotedMsg;

    // Message type checks for various media types
    if (m.type) {
        m.typeCheck = {};
        m.typeCheck.isImage = m.type === "imageMessage";
        m.typeCheck.isVideo = m.type === "videoMessage";
        m.typeCheck.isAudio = m.type === "audioMessage";
        m.typeCheck.isSticker = m.type === "stickerMessage";
        m.typeCheck.isContact = m.type === "contactMessage";
        m.typeCheck.isLocation = m.type === "locationMessage";

        // Check for quoted media types
        if (m.quoted?.message) {
            const typeQuoted = Object.keys(m.quoted.message)[0];
            m.typeCheck.isQuotedImage = typeQuoted === "imageMessage";
            m.typeCheck.isQuotedVideo = typeQuoted === "videoMessage";
            m.typeCheck.isQuotedAudio = typeQuoted === "audioMessage";
            m.typeCheck.isQuotedSticker = typeQuoted === "stickerMessage";
            m.typeCheck.isQuotedContact = typeQuoted === "contactMessage";
            m.typeCheck.isQuotedLocation = typeQuoted === "locationMessage";
        }
    }

    // Timestamp for the message
    m.messageTimestamp = msg.messageTimestamp ?? undefined;

    // If it's a group, fetch group metadata
    m.groupMetadata =
        m.typeCheck?.isSticker === false && m.isGroup
            ? await client.groupMetadata(m.from ?? "")
            : undefined;

    // Functions to send replies, handle errors, react, etc.
    m.reply = async (
        text: string,
        q: boolean = false,
    ): Promise<proto.WebMessageInfo> => {
        if (!m.isSelf) {
            return client.sendMessage(
                m.from ?? "",
                { text, mentions: [m.sender ?? ""] },
                { quoted: q ? msg : undefined },
            ) as Promise<proto.WebMessageInfo>;
        }
        return Promise.resolve({} as proto.WebMessageInfo);
    };

    m.button = async (text: string): Promise<proto.WebMessageInfo> => {
        if (!m.isSelf) {
            return client.sendMessage(m.from ?? "", {
                text,
                mentions: [m.sender ?? ""],
            }) as Promise<proto.WebMessageInfo>;
        }
        return Promise.resolve({} as proto.WebMessageInfo);
    };

    // Handle errors
    m.error = (text: string, q: boolean = false) => {
        m.reply?.(text, q);
        log.error("message", text);
        return Promise.resolve({} as proto.WebMessageInfo);
    };

    // React to the message (send emoji)
    m.react = (text: string = "👋🏻") => {
        if (!m.isSelf) {
            return client.sendMessage(m.from ?? "", {
                react: { text, key: msg.key },
            });
        }
        return Promise.resolve({} as WAMessage);
    };

    return m;
};
