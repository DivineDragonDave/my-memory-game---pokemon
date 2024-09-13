// theme.js
export const lightThemeOptions = {
  palette: {
    type: "light",
    primary: {
      main: "#000053",
    },
    secondary: {
      main: "#061c90",
    },
    background: {
      default: "#ebeff9",
      paper: "#ebeff9",
    },
    text: {
      primary: "#050607",
      secondary: "rgba(5,6,7,0.8)",
    },
    divider: "#20262D",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          backgroundColor: "#3458bb",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#1e3c85",
          },
        },
      },
    },
  },
};

export const darkThemeOptions = {
  palette: {
    type: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#060914",
      paper: "#1d1d1d",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
    divider: "#373737",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          backgroundColor: "#90caf9",
          color: "#121212",
          "&:hover": {
            backgroundColor: "#64b5f6",
          },
        },
      },
    },
  },
};
