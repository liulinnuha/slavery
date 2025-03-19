import { ICommand } from "@constants";
import axios from "axios";

export default {
    name: "meme",
    aliases: ["meme", "funmeme"],
    description: "Get a random meme",
    category: "fun",
    execute: async ({ msg, client }) => {
        const { from } = msg;
        try {
            const { data } = await axios.get("https://meme-api.com/gimme");
            if (!data || !data.url) throw new Error("No meme found.");

            await client.sendMessage(from, {
                image: { url: data.url },
                caption: data.title,
            });
        } catch (error) {
            await client.sendMessage(from, {
                text: "Failed to fetch meme. Try again later.",
            });
        }
    },
} as ICommand;
