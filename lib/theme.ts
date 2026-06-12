import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily:
      "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  palette: {
    mode: "light",
    background: {
      default: "#f2f2f7",
      paper: "#ffffff",
    },
    primary: {
      main: "#6e6e73",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#1c1c1e",
      secondary: "#6e6e73",
    },
    divider: "#d1d1d6",
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "& fieldset": { borderColor: "#d1d1d6" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #e5e5ea",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        },
      },
    },
  },
});

export default theme;
