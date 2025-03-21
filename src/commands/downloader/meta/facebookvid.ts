import { ICommand } from "@constants";
import { facebook } from "@libs/facebook";
import { PREFIX } from "src/config/env";
import { validateFacebookUrl } from "@utils/helpers";

export default {
    name: "fb",
    aliases: ["fbv", "fb", "fbvid"],
    category: "Downloader",
    description: "Download Facebook video",
    usage: `${PREFIX}fb <url>`,
    consume: 1,
    execute: async ({ msg, args, client, shortMessage }) => {
        if (args.length === 0) {
            await msg.reply(shortMessage.require.link);
            return;
        }
        const url = args[0];

        if (!validateFacebookUrl(url)) {
            return msg.reply(shortMessage.wronglink);
        }

        const result = await facebook(url);

        return await client.sendMessage(msg.from, {
            video: {
                url: result.link,
            },
            caption: result.title,
            mimetype: "video/mp4",
        });
    },
} as ICommand;
