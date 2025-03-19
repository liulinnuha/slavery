import { ICommand } from "@constants";
import axios from "axios";

export default {
    name: "dog",
    aliases: ["dog", "randomdog"],
    description: "Get a random cute dog image",
    category: "fun",
    execute: async ({ msg, client }) => {
        const { from } = msg;
        try {
            const { data } = await axios.get(
                "https://dog.ceo/api/breeds/image/random",
            );
            if (!data || !data.message) throw new Error("No dog image found.");

            await client.sendMessage(from, {
                image: { url: data.message },
                caption: "Here is a cute dog for you! 🐶",
            });
        } catch (error) {
            await client.sendMessage(from, {
                text: "Failed to fetch dog image. Try again later.",
            });
        }
    },
} as ICommand;
