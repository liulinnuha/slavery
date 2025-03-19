import { ICommand } from "@constants";

export default {
    name: "tagall",
    aliases: ["tagall", "everyone"],
    description: "Tag all members",
    category: "group",
    adminGroup: true,
    execute: async ({ msg, client, args, message }) => {
        const { from, myId, groupMetadata } = msg;
        const members = groupMetadata.participants
            .filter((member) => member.id !== myId) // Hapus ID bot
            .map((member) => member.id);
        if (members.length === 0) {
            return await client.sendMessage(
                from,
                { text: "No members to tag." },
                { quoted: message },
            );
        }
        let str = (args.join(" ") || "Tag all") + "\n\n";
        str += members.map((id) => `@${id.split("@")[0]}`).join("\n");
        await client.sendMessage(
            from,
            { text: str, mentions: members },
            { quoted: message },
        );
    },
} as ICommand;
