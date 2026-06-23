import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#f7931a" },
    background: { default: "#D4A017", paper: "#6B4423" },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "3px solid #000000",
          background: "linear-gradient(180deg, #7a4f2a 0%, #5d3a1d 100%)",
          boxShadow:
            "0 0 0 2px #c9962f inset, 0 6px 16px rgba(0,0,0,0.45), 0 0 18px rgba(201,150,47,0.25)",
        },
      },
    },
  },
});

export default theme;
