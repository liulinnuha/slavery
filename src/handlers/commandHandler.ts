import {
    commands,
    cooldown,
    IMessage,
    MessageError,
    startMessage,
} from "@constants";
import log from "@utils/logger";
import { watch } from "fs";
import fs from "fs";
import { serialize } from "@utils/serialize";
import {
    MessageUpsertType,
    WAMessage,
    WASocket,
} from "@whiskeysockets/baileys";
import colors from "colors";
import path from "path";
import { GlobSync } from "glob";

const textMessage = JSON.parse(fs.readFileSync("./message.json", "utf-8"));
export class CommandHandler {
    async messageHandler(
        m: { messages: WAMessage[]; type: MessageUpsertType },
        client: WASocket,
    ) {
        const message = m.messages[0];
        if (m.type !== "notify") return;
        if (message.key && message.key.remoteJid === "status@broadcast") return;
        if (!message.message) return;

        const msg = await serialize(message, client);
        // log.debug("serialized message", msg);

        const prefix = process.env.PREFIX || "!";
        const { sender, senderNumber, from, isGroup, myId, type, body } = msg;
        let shortMessage: IMessage = sender?.startsWith("62")
            ? textMessage.ind
            : textMessage.eng;
        const isBotAdmin = isGroup
            ? msg.groupMetadata?.participants.filter((ids) => ids.id == myId)[0]
                  ?.admin
            : null;
        const isSenderAdmin = isGroup
            ? msg.groupMetadata?.participants.filter(
                  (ids) => ids.id == sender,
              )[0]?.admin
            : null;

        if (
            type === "protocolMessage" ||
            type === "senderKeyDistributionMessage" ||
            !type
        )
            return;

        //starter: test
        if (/slavery/.test(msg.body) && !msg.isSelf) await msg?.react("💖");
        if (body === "prefix") return msg.reply("Prefix: " + prefix);

        const args = body ? body.trim().split(/ +/).slice(1) : [];
        const command = body
            ? body.startsWith(prefix)
                ? body
                      .slice(prefix.length)
                      .trim()
                      .split(/ +/)
                      .shift()
                      ?.toLowerCase() || null
                : null
            : null;

        if (!command) return;

        const getCommand =
            commands.get(String(command)) ||
            commands.find((v) => v.aliases?.includes(String(command)) ?? false);

        // console.log({ isBotAdmin, isSenderAdmin, args, getCommand });
        const now: number = Date.now();
        const cdStartMessage = 43200 * 1000;
        const getTime = startMessage.get(String(from));
        const timestamps = cooldown.get(String(from));
        const cdAmount: number = (getCommand?.cooldown || 5) * 1000;

        if (getCommand) {
            if (
                (getCommand?.adminGroup ||
                    getCommand?.groupOnly ||
                    getCommand?.isBotAdmin) &&
                !msg.isGroup
            )
                return msg?.reply(shortMessage.group.onlyGroup);
            if (getCommand?.privateOnly && msg.isGroup)
                return msg.reply(shortMessage.privateOnly);
            if (getCommand?.isAdminBot && !isSenderAdmin)
                return msg.reply(shortMessage.adminOnly);
            if (getCommand?.maintenance)
                return msg.reply(shortMessage.maintenance);
            if (getCommand?.isBotAdmin && !isBotAdmin)
                return msg.reply(shortMessage.group.botNoAdmin);

            const command_log = [
                colors.cyan(`[ ${msg.isGroup ? " GROUP " : "PRIVATE"} ]`),
                colors.white(msg?.body.substr(0, 50).replace(/\n/g, "")),
                colors.bold(`from ${msg.senderNumber}`),
            ];
            if (msg.isGroup) {
                command_log.push("in");
                if (msg?.groupMetadata)
                    command_log.push(msg?.groupMetadata.subject);
            }
            if (timestamps) {
                const expiration = timestamps + cdAmount;
                if (now < expiration) {
                    const command_log_spam = [
                        log.error(`[ SPAM ] from ${msg.senderNumber}`),
                    ];
                    if (msg.isGroup) {
                        command_log.push("in");
                        if (msg?.groupMetadata)
                            command_log.push(msg.groupMetadata.subject);
                    }
                    let timeLeft = (expiration - now) / 1000;
                    log.debug("spam", ...command_log_spam);
                    return await client.sendMessage(String(from), {
                        text: `Cooldown applies, please wait another _${timeLeft.toFixed(1)} second(s)_`,
                    });
                }
            }
            // if (!User.admin && !User.owner && !User.premium) {
            //     cooldown.set(msg.from, now);
            //     setTimeout(() => cooldown.delete(msg.from), cdAmount);
            // }
            if (!msg.isGroup)
                startMessage.set(String(from), now),
                    setTimeout(
                        () => startMessage.delete(String(from)),
                        cdStartMessage,
                    );

            console.log(colors.bold("[COMMAND LOG]"), ...command_log);
            if (getCommand?.execute)
                await getCommand
                    .execute({
                        client,
                        message,
                        msg,
                        command,
                        prefix,
                        args,
                        shortMessage,
                        // User,
                        // Group,
                    })
                    .then()
                    .catch((error: unknown) => {
                        if (error instanceof MessageError)
                            log.error("from", senderNumber);
                        else if (error instanceof Error)
                            msg.reply(`There is an error!`, true),
                                log.error("aw", error);
                    });
        } else {
            if (msg.isGroup) return;
            if (getTime && Date.now() < getTime + cdStartMessage) return;
            startMessage.set(String(from), now);
            setTimeout(() => startMessage.delete(String(from)), cdStartMessage);
            await client.sendMessage(String(from), {
                text: shortMessage.startMessage,
            });
        }
    }

    registerCommand() {
        const commandFiles = this.getAllFiles(
            path.resolve(__dirname, "..", "commands"),
        );
        for (const { basename, file } of commandFiles) {
            if (commands.get(basename)) {
                // console.log(chalk.whiteBright('├'), chalk.keyword('red')('[  ERROR  ]'), `File with filename ${basename} already register, try to change filename.`)
            } else if (typeof require(file).default !== "object") {
                log.error(
                    `Type of file ${basename} is ${typeof require(file).default}, required object.`,
                );
            } else {
                commands.set(basename, require(file).default);
                watch(file, (_event, filename) => {
                    const dir = path.resolve(file);
                    const base = path
                        .basename(String(filename), ".ts")
                        .toLowerCase();
                    if (dir in require.cache && _event == "change") {
                        delete require.cache[dir];
                        commands.set(base, require(file).default);
                        log.info(`reloaded ${filename}`);
                    }
                });
            }
        }
    }

    getAllFiles(directory: string) {
        let pathFiles = new GlobSync(path.join(directory, "*.ts")).found;
        pathFiles.push(
            ...new GlobSync(path.join(directory, "*", "*.ts")).found,
        );
        pathFiles.push(
            ...new GlobSync(path.join(directory, "*", "*", "*.ts")).found,
        );
        pathFiles = pathFiles.filter((v) => v.endsWith(".ts"));
        const files = [] as { basename: string; file: string }[];
        for (let file of pathFiles) {
            const basename = path.basename(file, ".ts").toLowerCase();
            files.push({
                basename,
                file,
            });
        }
        return files;
    }
}
