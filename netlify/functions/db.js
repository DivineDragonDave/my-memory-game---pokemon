// netlify/functions/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw new Error("Failed to connect to MongoDB");
  }
};

const highScoreSchema = new mongoose.Schema({
  playerName: String,
  score: Number,
  date: { type: Date, default: Date.now },
});

const HighScore = mongoose.model("HighScore", highScoreSchema);

export { connectDB, HighScore };
