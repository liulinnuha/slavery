import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    groupId: { type: String, required: "global" },
    score: { type: Number, default: 0 },
    lastAnsweredAt: { type: Date, default: Date.now },
});

export const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

export const addScore = async (
    userId: string,
    username: string,
    groupId: string,
    points = 1,
) => {
    try {
        await Leaderboard.findOneAndUpdate(
            { userId, groupId },
            { $inc: { score: points }, username, lastAnsweredAt: Date.now() },
            { upsert: true, new: true },
        );

        await Leaderboard.findOneAndUpdate(
            { userId, groupId: "global" },
            { $inc: { score: points }, username, lastAnsweredAt: Date.now() },
            { upsert: true, new: true },
        );
    } catch (error) {
        console.error("Error adding score:", error);
    }
};

export const getLeaderboard = async (
    groupId: string = "global",
    limit: number = 10,
) => {
    try {
        return await Leaderboard.find({ groupId })
            .sort({ score: -1 })
            .limit(limit);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
};

export const resetLeaderboard = async (groupId: string = "global") => {
    try {
        return await Leaderboard.deleteMany({ groupId });
    } catch (error) {
        console.error("Error resetting global leaderboard:", error);
    }
};
