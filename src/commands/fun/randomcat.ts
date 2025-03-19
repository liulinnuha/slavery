import { ICommand } from "@constants";
import axios from "axios";

export default {
    name: "cat",
    aliases: ["cat", "randomcat"],
    description: "Get a random cute cat image",
    category: "fun",
    execute: async ({ msg, client }) => {
        const { from } = msg;
        try {
            const { data } = await axios.get(
                "https://api.thecatapi.com/v1/images/search",
            );
            if (!data || !data[0].url) throw new Error("No cat image found.");

            await client.sendMessage(from, {
                image: { url: data[0].url },
                caption: "Here is a cute cat for you! 🐱",
            });
        } catch (error) {
            await client.sendMessage(from, {
                text: "Failed to fetch cat image. Try again later.",
            });
        }
    },
} as ICommand;
