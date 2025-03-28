import axios from "axios";
import log from "@utils/logger";
import { ICommand } from "@constants";
import { PREFIX } from "src/config/env";

export default {
    name: "joke",
    aliases: ["joke"],
    category: "fun",
    usage: `${PREFIX}joke`,
    description: `Get a random joke`,
    execute: async ({ msg }) => {
        let joke: string = "Gagal Mengambil joke !";
        try {
            const response = await axios.get(
                "https://official-joke-api.appspot.com/random_joke",
            );
            joke = `${response.data.setup} - ${response.data.punchline}`;
        } catch (err) {
            log.error("Error getting job", err);
        }
        return msg.reply(`${joke} 🤣`);
    },
} as ICommand;
