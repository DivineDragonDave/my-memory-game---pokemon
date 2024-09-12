export const themeOptions = {
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
