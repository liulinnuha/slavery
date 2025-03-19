import mongoose from "mongoose";

export async function connectDB(url: string) {
    mongoose
        .connect(url)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB:", error);
        });
}
