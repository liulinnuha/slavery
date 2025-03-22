import { ICommand } from "@constants";
import { youtube } from "@libs/youtube";
import { parseYoutubeUrl } from "@utils/helpers";
import { PREFIX } from "src/config/env";

export default {
    name: "ytmp3",
    aliases: ["ytmp3", "yt3"],
    category: "Downloader",
    description: "Download YouTube video in MP3 format",
    usage: `${PREFIX}ytmp3 <video_url>`,
    consume: 1,
    execute: async ({ msg, args, client, shortMessage }) => {
        if (args.length === 0) {
            await msg.reply(shortMessage.require.link);
            return;
        }

        const { url, valid } = parseYoutubeUrl(args.join(" "));
        if (!valid) return msg.reply(shortMessage.wronglink);

        const result = await youtube(url, "mp3");
        await client.sendMessage(msg.from, {
            image: { url: result.thumbnail },
            caption: `Title: ${result.title} \nSize: ${result.size}\n\`\`\`Converting Audio, Please Wait...\`\`\``,
        });
        await client.sendMessage(msg.from, {
            audio: { url: result.link },
            mimetype: "audio/mp4",
        });
    },
} as ICommand;
