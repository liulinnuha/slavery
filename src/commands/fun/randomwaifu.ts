import { ICommand } from "@constants";
import axios from "axios";

export default {
    name: "waifu",
    aliases: ["waifu", "animegirl"],
    description: "Get a random anime waifu",
    category: "fun",
    execute: async ({ msg, client }) => {
        const { from } = msg;
        try {
            const { data } = await axios.get(
                "https://api.waifu.pics/sfw/waifu",
            );
            if (!data || !data.url) throw new Error("No waifu found.");

            await client.sendMessage(from, {
                image: { url: data.url },
                caption: "Your random waifu is here! 💖",
            });
        } catch (error) {
            await client.sendMessage(from, {
                text: "Failed to fetch waifu. Try again later.",
            });
        }
    },
} as ICommand;
