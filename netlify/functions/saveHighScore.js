// netlify/functions/saveHighScore.js
import { connectDB, HighScore } from "./db";

export const handler = async (event, context) => {
  try {
    await connectDB();
    const newScore = new HighScore(JSON.parse(event.body));
    await newScore.save();
    return {
      statusCode: 201,
      body: JSON.stringify(newScore),
    };
  } catch (err) {
    console.error("Error saving new high score:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to save high score" }),
    };
  }
};
