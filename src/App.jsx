import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Button,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import "./App.css";
import Card from "./Card";

const App = () => {
  const [cards, setCards] = useState([]);
  const [flips, setFlips] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [highScores, setHighScores] = useState([]);
  const [score, setScore] = useState(100); // Initialize the score to 100

  useEffect(() => {
    shuffleCards();
    fetchHighScores();
  }, []);

  useEffect(() => {
    console.log("Rendering highScores:", highScores);
  }, [highScores]);

  const fetchHighScores = async () => {
    try {
      const response = await fetch("/.netlify/functions/getHighScores");
      const data = await response.json();
      console.log("Fetched high scores:", data);

      if (Array.isArray(data)) {
        setHighScores(data);
      } else {
        console.error("High scores is not an array:", data);
        setHighScores([]); // Sätt en tom array för att undvika .map()-fel
      }
    } catch (error) {
      console.error("Failed to fetch high scores:", error);
      setHighScores([]); // Sätt en tom array för att undvika .map()-fel
    }
  };

  const saveHighScore = async () => {
    if (!playerName) {
      alert("Please enter your name before saving your score!");
      return;
    }

    const newScore = { playerName, score };

    await fetch("/.netlify/functions/saveHighScore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newScore),
    });

    // Hämta de nya high scores för att uppdatera listan
    fetchHighScores();
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffleCards = () => {
    const cardNames = [
      "101010101111000110101",
      "101101011100001111001",
      "101111110110000111101",
      "101100011101011111011",
      "101010101100000111011",
      "101101010111011000011",
      "111110000110101010101",
      "100101010101010101011",
      "100101101010111010101",
      "101011110101100110101",
      "101001010010111001101",
      "101011010101010101101",
      "101011011001011111101",
      "100101101010101010101",
      "100110100111011000001",
      "101010100101100101011",
      "100101111011001001101",
      "101001010101010101011",
      "101010111101001110111",
      "101010110100110010101",
      "101010101100101011111",
      "100110100101010111001",
      "101102100101110010111",
      "100000101011100101011",
      "100110110100110110011",
      "110100111000101110101",
      "100101010100011010101",
      "101011000110101011011",
      "101001010101110100101",
      "101011110010010110011",
      "110001111000101010011",
      "111100111110100111011",
      "101110101101110011011",
      "100101101001011101111",
      "100101011001011011111",
      "101100100000110010101",
      "101101011001010111011",
      "101101010101101111111",
      "110101000010100000111",
      "100101011011111111111",
      "100101010011111111111",
      "100101001011111111111",
      "100101111011111111111",
      "100100011011111111111",
      "100101011010111111111",
      "100101011110111111111",
      "100101011111111111101",
      "100101011010110111101",
      "100101011011010111101",
      "100101011011011011101",
      "100101011011110101111",
      "100101011011111111011",
      "100101011011110101011",
      "100101011011011101011",
      "100101011011001011111",
      "100101011011101011011",
      "100101011011101010111",
      "100101011011101111111",
      "100101011011101011111",
      "100101010010111111001",
      "100101111011110101111",
      "100101011011110011111",
      "100001111011111111111",
      "101101011011111111111",
      "100111011011111111111",
      "100110011011111111111",
      "100100111011110110101",
      "100100111011111100101",
      "100101011011111011011",
      "100101011011110110101",
      "100101011010110111011",
      "100101011011101111101",
      "100101011010111011111",
      "100101011001110111111",
      "100101011000111111111",
      "100101011010010111111",
      "100101011011011111111",
      "100101011011110111111",
      "100101011000110111111",
    ];
    const selectedCards = shuffleArray([...cardNames]).slice(0, 10);
    const doubledCards = [...selectedCards, ...selectedCards];
    const shuffledCards = shuffleArray(doubledCards);
    setCards(
      shuffledCards.map((name) => ({
        name,
        isFlipped: false,
        isMatched: false,
      }))
    );
    setFlips(0);
    setMatches(0);
    setIsChecking(false);
    setScore(100); // Reset score to 100 on shuffle
  };

  const handleCardClick = (index) => {
    if (!isGameActive) {
      startTimer();
      setIsGameActive(true);
    }

    if (isChecking) return;

    const newCards = [...cards];
    if (newCards[index].isFlipped || newCards[index].isMatched) return;

    newCards[index].isFlipped = true;
    setCards(newCards);
    setFlips(flips + 1);

    calculateScore(timer, flips + 1); // Calculate score based on time and flips

    const flippedCards = newCards.filter(
      (card) => card.isFlipped && !card.isMatched
    );

    if (flippedCards.length === 2) {
      setIsChecking(true);

      const isMatch = flippedCards[0].name === flippedCards[1].name;
      if (isMatch) {
        flippedCards.forEach((card) => (card.isMatched = true));
        setMatches(matches + 1);

        if (matches + 1 === 10) {
          setTimeout(() => {
            clearInterval(timerInterval);
            saveHighScore();
            alert(
              `Congratulations, ${playerName}! You completed the game in ${timer} seconds and ${
                flips + 1
              } flips! Your score is ${score}.`
            );
          }, 500);
        }
      } else {
        setTimeout(() => {
          flippedCards.forEach((card) => (card.isFlipped = false));
          setCards([...newCards]);
        }, 500);
      }

      setTimeout(() => {
        setIsChecking(false);
      }, 400);
    }
  };

  const calculateScore = (currentTimer, currentFlips) => {
    let newScore = 100;

    // Lose 1 point for every 5 seconds after 20 seconds
    if (currentTimer > 20) {
      newScore -= Math.floor((currentTimer - 20) / 5);
    }

    // Lose 1 point for every additional flip after 30 flips
    if (currentFlips > 30) {
      newScore -= currentFlips - 30;
    }

    setScore(newScore);
  };

  const startTimer = () => {
    setTimer(0);
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const resetGame = () => {
    clearInterval(timerInterval);
    setIsGameActive(false);
    shuffleCards();
  };

  return (
    <Container>
      <Typography variant="h1" align="center">
        Memory
      </Typography>
      <Typography variant="subtitle1" align="center">
        Click a card to start
      </Typography>
      <TextField
        label="Enter your name"
        variant="outlined"
        fullWidth
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        disabled={isGameActive}
        sx={{ mb: 2 }}
        InputProps={{
          style: { color: "#fff410" },
        }}
        InputLabelProps={{
          style: { color: "#ec9410" },
        }}
      />

      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Button
            sx={{ mb: 1 }}
            variant="contained"
            color="primary"
            onClick={resetGame}
          >
            Reset Game
          </Button>
        </Grid>
        <Grid item>
          <Typography
            sx={{ margin: 1, fontSize: 26 }}
            variant="h6"
            className="timer"
          >
            Time: {timer} seconds Score: {score}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          marginTop: 0,
          marginLeft: "-8px",
          marginBottom: "0px !important",
        }}
        justifyContent="center"
        alignItems="center"
        spacing={2}
        className="deck"
      >
        {cards.map((card, index) => (
          <Grid sx={{ mb: 1 }} item key={index}>
            <Card card={card} index={index} onClick={handleCardClick} />
          </Grid>
        ))}
      </Grid>
      <Typography sx={{ color: "#ec9410" }} variant="h3" align="center">
        High Scores
      </Typography>
      <Box
        component="ol"
        sx={{
          color: "#ec9410",
          paddingLeft: "0",
          listStylePosition: "inside",
          textAlign: "center",
        }}
      >
        {highScores.length > 0 ? (
          highScores.map((score, index) => (
            <li key={index}>
              {score.playerName} - {score.score} points
            </li>
          ))
        ) : (
          <Typography variant="h6">No high scores available.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default App;
