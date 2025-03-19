import { ICommand } from "@constants";
import { Quiz } from "@schema/trivia/quizSchema";
import axios from "axios";

export default {
    name: "quiz",
    aliases: ["quiz", "trivia"],
    description: "Get a random trivia question",
    category: "fun",
    execute: async ({ msg, client }) => {
        const { from } = msg;
        try {
            const { data } = await axios.get(
                "https://opentdb.com/api.php?amount=1&type=multiple",
            );
            if (!data || !data.results || data.results.length === 0)
                throw new Error("No trivia question found.");

            const question = data.results[0];
            const correctAnswer = question.correct_answer;
            const options = [...question.incorrect_answers, correctAnswer].sort(
                () => Math.random() - 0.5,
            );

            // Simpan jawaban benar di cache
            await Quiz.create({
                groupId: from,
                question: question.question,
                answer: correctAnswer,
                category: question.category,
                difficulty: question.difficulty,
                active: true,
            });

            let quizMessage = `🧠 *Trivia Quiz*\n\n*${question.question}*\n\n`;
            options.forEach((opt, index) => {
                quizMessage += `➤ *${index + 1}.* ${opt}\n`;
            });

            quizMessage += `\nKetik angka *1-4* untuk menjawab!`;

            await client.sendMessage(from, { text: quizMessage });
        } catch (error) {
            console.error(error);
            await client.sendMessage(from, {
                text: "Gagal mengambil quiz. Coba lagi nanti.",
            });
        }
    },
} as ICommand;
