// netlify/functions/getHighScores.js
import { connectDB, HighScore } from "./db";

export const handler = async (event, context) => {
  try {
    console.log("Starting connection to MongoDB...");
    await connectDB();
    console.log("Connected to MongoDB successfully.");

    const scores = await HighScore.find().sort({ score: -1 }).limit(10);
    console.log("Fetched high scores from database:", scores);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scores),
    };
  } catch (err) {
    console.error("Error occurred:", err.message);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Failed to fetch high scores",
        error: err.message,
      }),
    };
  }
};
