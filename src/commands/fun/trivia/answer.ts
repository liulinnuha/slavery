import { ICommand } from "@constants";
import { Quiz } from "@schema/trivia/quizSchema";
import { addScore } from "@schema/trivia/leaderboardSchema";

export default {
    name: "answer",
    aliases: ["answer", "jawab"],
    description: "Answer a trivia quiz",
    category: "fun",
    execute: async ({ msg, client, args }) => {
        const { from, sender, senderNumber, pushName } = msg;
        const userAnswer = args.join(" ").trim(); // Ambil jawaban user
        if (!userAnswer) return msg.reply("Masukkan jawaban!");

        // Cek apakah ada quiz aktif untuk user/grup ini
        const quiz = await Quiz.findOne({ groupId: from, active: true });
        if (!quiz) return msg.reply("Tidak ada kuis yang aktif saat ini.");

        const correctAnswer = quiz.answer; // Ambil jawaban yang benar

        if (!correctAnswer) {
            return msg.reply(
                "Terjadi kesalahan. Coba mulai quiz baru dengan *!quiz*.",
            );
        }

        // Cek apakah jawaban benar atau salah
        if (correctAnswer.toLowerCase() === userAnswer.toLowerCase()) {
            await addScore(sender, pushName, from);
            await Quiz.deleteOne({ _id: quiz._id });
            client.sendMessage(from, {
                text: `🏆 *Jawaban benar!* \n\n+1 poin untuk ${sender.split("@")[0]}`,
            });
        } else {
            client.sendMessage(from, { text: "Jawaban salah! Coba lagi." });
            // await client.sendMessage(from, {
            //     text: `❌ Jawaban salah! Jawaban yang benar adalah: *${correctAnswer}*`,
            // });
        }
    },
} as ICommand;
