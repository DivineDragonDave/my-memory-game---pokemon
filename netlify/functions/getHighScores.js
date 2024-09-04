// netlify/functions/getHighScores.js (for Pokemon game)
import { connectDB, PokemonHighScore } from "./db";

export const handler = async (event, context) => {
  try {
    console.log("Starting connection to MongoDB...");
    await connectDB();
    console.log("Connected to MongoDB successfully.");

    const scores = await PokemonHighScore.find().sort({ score: -1 }).limit(10); // Fetch from the 'pokemon' collection
    console.log("Fetched Pokemon high scores from database:", scores);

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
        message: "Failed to fetch Pokemon high scores",
        error: err.message,
      }),
    };
  }
};
