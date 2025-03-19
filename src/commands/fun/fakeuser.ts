import { ICommand } from "@constants";
import axios from "axios";

export default {
    name: "fakeuser",
    aliases: ["fakeuser", "randomuser"],
    description: "Generate a fake user",
    category: "fun",
    execute: async ({ msg, client }) => {
        const { from } = msg;
        try {
            const { data } = await axios.get("https://randomuser.me/api/");
            if (!data || !data.results || data.results.length === 0)
                throw new Error("No fake user found.");

            const user = data.results[0];
            const userInfo = `👤 *Fake User Generated*\n\n*Name:* ${user.name.first} ${user.name.last}\n*Gender:* ${user.gender}\n*Age:* ${user.dob.age}\n*Country:* ${user.location.country}\n*Email:* ${user.email}`;

            await client.sendMessage(from, { text: userInfo });
        } catch (error) {
            await client.sendMessage(from, {
                text: "Failed to generate fake user. Try again later.",
            });
        }
    },
} as ICommand;
