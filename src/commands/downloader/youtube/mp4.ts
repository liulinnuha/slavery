import { ICommand } from "@constants";
import { youtube } from "@libs/youtube";
import { parseYoutubeUrl } from "@utils/helpers";
import { PREFIX } from "src/config/env";

export default {
    name: "ytmp4",
    aliases: ["ytmp4", "yt4"],
    category: "Downloader",
    description: "Download YouTube video in MP4 format",
    usage: `${PREFIX}ytmp4 <video_url>`,
    consume: 1,
    execute: async ({ msg, args, client, shortMessage }) => {
        if (args.length === 0) {
            await msg.reply(shortMessage.require.link);
            return;
        }

        const { url, valid } = parseYoutubeUrl(args.join(" "));
        if (!valid) return msg.reply(shortMessage.wronglink);

        const result = await youtube(url, "mp4");
        await client.sendMessage(msg.from, {
            image: { url: result.thumbnail },
            caption: `Title: ${result.title} \nSize: ${result.size}\n\`\`\`Downloading Video, Please Wait...\`\`\``,
        });

        await client.sendMessage(msg.from, {
            video: { url: result.link },
            mimetype: "video/mp4",
        });
    },
} as ICommand;
