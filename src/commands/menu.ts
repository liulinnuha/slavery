import { commands, ICommand } from "@constants";
import { WASocket } from "@whiskeysockets/baileys";
import { BOTNAME } from "src/config/env";

export default {
    aliases: ["hlist", "menulist", "lmenu", "info"],
    name: "menu",
    category: "general",
    description: "To display the menu by list, and see how to use the menu",
    maintenance: false,
    execute: async ({ client, msg, prefix, args }) => {
        const { from } = msg;
        if (args.length >= 1) {
            const name = args[0].toLowerCase();
            const cmd =
                commands.get(name) ||
                commands.find(
                    (cmd) => !!cmd.aliases && cmd.aliases.includes(name),
                );
            let text: string = ``;
            if (!cmd || cmd.category == "private")
                return await msg.reply("Command not found or private");
            else text += `*${name}*\n`;
            text += `*Aliases:* ${!!cmd.aliases ? cmd.aliases.join(", ") : "None"}\n`;
            text += `*Description:* ${cmd.description}\n`;
            text += `*Usage:* ${!!cmd.usage ? cmd.usage : "None"}\n`;
            text += `*Only in Group:* ${cmd.groupOnly ? "Yes" : "No"}\n`;
            text += `*Only in Private:* ${cmd.privateOnly ? "Yes" : "No"}\n`;
            text += `*Admin Only:* ${!!cmd.adminGroup ? "Yes" : "No"}\n`;
            text += `*Maintenance:* ${cmd.maintenance ? "Yes" : "No"}\n`;

            return await msg.reply(text);
        }
        const cmds = commands.keys();
        let category: string[] = [];
        for (const cmd of cmds) {
            let info = commands.get(cmd);
            if (!cmd) continue;
            if (info.category == "private") continue;
            if (Object.keys(category).includes(info.category)) {
                category[info.category].push(info);
            } else {
                category[info.category] = [];
                category[info.category].push(info);
            }
        }
        let str = [`===<[${BOTNAME}]>===`];
        let t = `*Available Commands*\n\n`;
        const keys = Object.keys(category);

        for (const key of keys) {
            let data = category[key]
                .map((cmd) => cmd.name + " | " + cmd.description)
                .join("\n-> ");
            t += `*${key.toUpperCase()}*\`\`\`\n-> ${data}\`\`\`\n\n`;
        }
        str.push(t);

        return client.sendMessage(from, {
            text:
                str.join("\n") +
                `\n\n\`\`\`how to use: ${prefix}<command> | ex: ${prefix}joke\`\`\``,
        });
    },
} as ICommand;
