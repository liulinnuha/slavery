import { ICommand } from "@constants";
import axios from "axios";

export default {
    name: "quote",
    aliases: ["quote", "motivation"],
    description: "Get a random motivational quote",
    category: "fun",
    execute: async ({ msg, client }) => {
        const { from } = msg;
        try {
            const { data } = await axios.get("http://api.quotable.io/random");
            if (!data || !data.content) throw new Error("No quote found.");

            const quoteMessage = `*"${data.content}"*\n\n- ${data.author}`;
            await client.sendMessage(from, { text: quoteMessage });
        } catch (error) {
            await client.sendMessage(from, {
                text: "Failed to fetch quote. Try again later.",
            });
        }
    },
} as ICommand;
