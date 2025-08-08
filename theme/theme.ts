"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3a5a70",
    },

    background: {
      default: "#f4f6f7",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e1e1e",
      secondary: "#5c5c5c",
    },
  },
  typography: {
    fontFamily: "var(--font-roboto)",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 500,
          fontSize: "1rem",
          padding: "10px 20px",
          backgroundColor: "#1f1f1f",
          color: "#ffffff",
          transition: "all 0.2s ease-in-out",
          boxShadow: "none",

          "&:hover": {
            backgroundColor: "#2c2c2c",
          },
          "&:active": {
            backgroundColor: "#3a3a3a",
          },
          "&:disabled": {
            backgroundColor: "#cccccc",
            color: "#777777",
          },
        },
      },
    },
  },
});

export default theme;
