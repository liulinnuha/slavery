import { Schema, model } from "mongoose";

const quizSchema = new Schema({
    groupId: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const Quiz = model("Quiz", quizSchema);
