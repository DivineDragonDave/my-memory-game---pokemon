import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Button,
  Typography,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  const [score, setScore] = useState(100);
  const [openDialog, setOpenDialog] = useState(true); // Modal control

  // Shuffle and initialize cards only after the dialog is closed
  useEffect(() => {
    if (!openDialog) {
      shuffleCards(); // Shuffle cards when dialog is closed
    }
  }, [openDialog]);

  useEffect(() => {
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
        setHighScores([]);
      }
    } catch (error) {
      console.error("Failed to fetch high scores:", error);
      setHighScores([]);
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

    calculateScore(timer, flips + 1);

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

    if (currentTimer > 15) {
      newScore -= Math.floor((currentTimer - 15) / 5);
    }

    if (currentFlips > 25) {
      newScore -= currentFlips - 25;
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

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
    shuffleCards(); // Trigger card shuffle after dialog is closed
  };

  return (
    <Container>
      <Box>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle
            sx={{
              background: "#3458bb",
            }}
          >
            Game Rules
          </DialogTitle>
          <DialogContent
            sx={{
              background: "#3458bb",
            }}
          >
            <Typography variant="body1">
              Welcome to the Memory Game! Here are the rules:
              <ol>
                <li>Flip two cards and try to match them.</li>
                <li>If they match, they stay flipped.</li>
                <li>If not, they flip back.</li>
                <li>Match all pairs to win.</li>
                <li>
                  You lose points for taking too much time or too many flips.
                </li>
                <li>
                  Enter your name before flipping the cards if you want to be on
                  the high score board, or skip if you want to remain anonymous.
                  You can't enter your name after the game is done.
                </li>
              </ol>
              Click "Start Game" to begin playing.
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              background: "#3458bb",
            }}
          >
            <Button onClick={handleCloseDialog} color="primary">
              Start Game
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
          style: { color: "#fecf01" },
        }}
        InputLabelProps={{
          style: { color: "#fecf01" },
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
      <Typography sx={{ color: "#3458bb" }} variant="h3" align="center">
        High Scores
      </Typography>
      <Box
        component="ol"
        sx={{
          color: "#3458bb",
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
