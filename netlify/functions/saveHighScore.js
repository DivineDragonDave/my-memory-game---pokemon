// netlify/functions/saveHighScore.js (for Pokemon game)
import { connectDB, PokemonHighScore } from "./db";

export const handler = async (event, context) => {
  try {
    await connectDB();
    const newScore = new PokemonHighScore(JSON.parse(event.body)); // Create a new high score for the Pokemon collection
    await newScore.save();
    return {
      statusCode: 201,
      body: JSON.stringify(newScore),
    };
  } catch (err) {
    console.error("Error saving new Pokemon high score:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to save Pokemon high score" }),
    };
  }
};
