import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Anslut till MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Skapa en schema och modell för high scores
const highScoreSchema = new mongoose.Schema({
  playerName: String,
  score: Number,
  date: { type: Date, default: Date.now },
});

const HighScore = mongoose.model("HighScore", highScoreSchema);

// API-endpoint för att få high scores
app.get("/api/highscores", async (req, res) => {
  try {
    const scores = await HighScore.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (err) {
    console.error("Error fetching high scores:", err);
    res.status(500).json({ message: "Failed to fetch high scores" });
  }
});

// API-endpoint för att lägga till en ny high score
app.post("/api/highscores", async (req, res) => {
  try {
    const newScore = new HighScore(req.body);
    await newScore.save();
    res.status(201).json(newScore);
  } catch (err) {
    console.error("Error saving new high score:", err);
    res.status(500).json({ message: "Failed to save high score" });
  }
});

// Starta servern
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
