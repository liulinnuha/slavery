import axios from "axios";
import { ICommand } from "@constants";
import FormData from "form-data";

export default {
    name: "tiktok",
    aliases: ["tt"],
    description: "Download video from TikTok",
    category: "Downloader",
    execute: async ({ msg, client, args, message }) => {
        const { from } = msg;
        const url = args[0];

        if (!url || !url.includes("tiktok.com")) {
            return client.sendMessage(
                from,
                { text: "Masukkan link TikTok yang valid!" },
                { quoted: message },
            );
        }

        try {
            const formData = new FormData();
            formData.append("url", url);
            const response = await axios.post(
                "https://api.tikmate.app/api/lookup",
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        origin: "https://tikmate.app",
                        "user-agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/133.0.0.0 Safari/537.36",
                    },
                },
            );

            if (!response.data.success) {
                return client.sendMessage(
                    from,
                    { text: "Failed to fetch TikTok video information." },
                    { quoted: message },
                );
            }

            const {
                id,
                token,
                desc,
                comment_count,
                like_count,
                share_count,
                author_name,
                cover,
            } = response.data;

            const downloadUrl: string = `https://tikmate.app/download/${token}/${id}.mp4?hd=1`;
            await client.sendMessage(msg.from, {
                image: { url: cover },
                caption: `*Author*: ${author_name} \n*Desc*: ${desc} \n*Like*: ${like_count}\n*Share*: ${share_count}\n*Comment*: ${comment_count}\n\`\`\`DownloadUrl: ${downloadUrl}\`\`\``,
            });

            // return await client.sendMessage(
            //     from,
            //     {
            //         video: { url: downloadUrl },
            //         mimetype: "video/mp4",
            //         caption: "Berikut video TikTok yang diunduh.",
            //     },
            //     { quoted: message },
            // );
        } catch (error) {
            console.error("Error downloading TikTok video:", error);
            client.sendMessage(
                from,
                { text: "Terjadi kesalahan saat mengunduh video." },
                { quoted: message },
            );
        }
    },
} as ICommand;
