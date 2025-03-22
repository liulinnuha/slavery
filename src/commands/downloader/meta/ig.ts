import { ICommand } from "@constants";
import { validateInstagramUrl } from "@utils/helpers";
import { PREFIX } from "src/config/env";
import { getImages, getVideos } from "@libs/instagram";

export default {
    name: "ig",
    aliases: ["ig", "insta"],
    category: "Downloader",
    description: "Download Instagram videos and images",
    usage: `${PREFIX}ig <url>`,
    consume: 1,
    execute: async ({ msg, args, client, shortMessage }) => {
        if (args.length === 0) {
            await msg.reply(shortMessage.require.link);
            return;
        }

        const url: string = args[0];
        if (!validateInstagramUrl(url).isValid) {
            await msg.reply(shortMessage.wronglink);
            return;
        }

        const urlType: string = validateInstagramUrl(url).type;

        if (urlType !== "image") {
            const result = await getVideos(url);

            if (!result || !result.url) {
                await msg.reply("Something went wrong");
                return;
            }

            try {
                await client.sendMessage(msg.from, {
                    video: {
                        url: result.url,
                    },
                    mimetype: "video/mp4",
                    caption: result.title,
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            const result = await getImages(url);

            if (!result || !result.urls) {
                await msg.reply("Something went wrong");
                return;
            }

            const urls = result.urls;
            for (const url of urls) {
                try {
                    await client.sendMessage(msg.from, {
                        image: {
                            url: url,
                        },
                        mimetype: "image/jpeg",
                    });

                    //delay tipis biar gk di anggep spam
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                } catch (error) {
                    console.error(error);
                    await msg.reply(
                        "Gagal mengunduh salah satu gambar preview.",
                    );
                }
            }
        }
    },
} as ICommand;
