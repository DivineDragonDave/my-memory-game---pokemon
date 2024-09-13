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
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { lightThemeOptions, darkThemeOptions } from "./utils/them";
import "./App.css";
import Card from "./Card";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentTheme = createTheme(
    isDarkMode ? darkThemeOptions : lightThemeOptions
  );
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const cheatLogger = setInterval(() => {
      console.log("Cheater");
    }, 1000);

    return () => clearInterval(cheatLogger);
  }, []);

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
  const [openDialog, setOpenDialog] = useState(true);
  const [openResultDialog, setOpenResultDialog] = useState(false);

  useEffect(() => {
    if (!openDialog) {
      shuffleCards();
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
    setScore(100);
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
            setOpenResultDialog(true);
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
    setTimer(0);
    setIsGameActive(false);
    setOpenResultDialog(false);
    shuffleCards();
    setTimeout(() => {
      shuffleCards();
    }, 1000);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    shuffleCards();
  };

  const handleCloseResultDialog = () => {
    setOpenResultDialog(false);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Container>
        <Box>
          <Button
            onClick={toggleTheme}
            sx={{ position: "fixed", top: 16, right: 16 }}
          >
            Switch to {isDarkMode ? "Light" : "Dark"} Mode
          </Button>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle
              sx={{
                fontWeight: "900",
                fontSize: "32px",
              }}
            >
              Game Rules
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ fontWeight: "500", fontSize: "20px" }}>
                Here are the rules:
                <ol>
                  <li>Flip two cards and try to match them.</li>
                  <li>If they match, they stay flipped.</li>
                  <li>If not, they flip back.</li>
                  <li>Match all pairs to win.</li>

                  <li>
                    Enter your name before flipping the cards if you want to be
                    on the high score board, or skip if you want to remain
                    anonymous. You can't enter your name after the game is done.
                  </li>
                </ol>
              </Typography>
              <Button onClick={handleCloseDialog}>Start Game</Button>
            </DialogContent>
          </Dialog>

          <Dialog open={openResultDialog} onClose={handleCloseResultDialog}>
            <DialogTitle
              sx={{
                background: "#3458bb",
              }}
            >
              Game Completed!
            </DialogTitle>
            <DialogContent
              sx={{
                background: "#3458bb",
              }}
            >
              <Typography variant="body1">
                Congratulations, {playerName}! <br />
                You completed the game in {timer} seconds and {flips} flips!{" "}
                <br />
                Your score is {score}.
              </Typography>
            </DialogContent>
            <DialogActions
              sx={{
                background: "#3458bb",
              }}
            >
              <Button onClick={resetGame} color="primary">
                Play Again
              </Button>
              <Button onClick={handleCloseResultDialog} color="primary">
                Close
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
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Button variant="contained" color="primary" onClick={resetGame}>
            Reset Game
          </Button>
          <Typography
            sx={{
              fontSize: 28,
              display: "flex",
              alignItems: "center",
            }}
            variant="h6"
            className="timer"
          >
            Time: {timer} seconds Score: {score}
          </Typography>
        </Box>

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
        <Typography marginTop={"16px"} variant="h3" align="center">
          High Scores
        </Typography>
        <Box
          component="ol"
          sx={{
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
    </ThemeProvider>
  );
};

export default App;
