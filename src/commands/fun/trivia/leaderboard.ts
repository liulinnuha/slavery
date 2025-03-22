import { ICommand } from "@constants";
import { getLeaderboard } from "@schema/trivia/leaderboardSchema";

export default {
    name: "leaderboard",
    aliases: ["lb", "leaderboard"],
    description: "Show the leaderboard of trivia scores",
    category: "fun",
    execute: async ({ msg, client, args }) => {
        const { from, isGroup } = msg;
        const groupId = isGroup ? from : "global";
        const topUsers = await getLeaderboard(groupId);

        if (topUsers.length === 0) {
            return client.sendMessage(from, {
                text: "Leaderboard masih kosong!",
            });
        }

        let response = `🏆 *Leaderboard ${groupId === "global" ? "Global" : "Group"}* 🏆\n\n`;
        topUsers.forEach((user, index) => {
            response += `${index + 1}. *${user.username}* - ${user.score} poin\n`;
        });

        client.sendMessage(from, { text: response });
    },
} as ICommand;
