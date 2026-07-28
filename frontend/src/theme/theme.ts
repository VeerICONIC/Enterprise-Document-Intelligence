import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#3B82F6",
        },
        background: {
            default: "#0F172A",
            paper: "#1E293B",
        },
    },

    shape: {
        borderRadius: 12,
    },

    typography: {
        fontFamily: "Inter, sans-serif",
    },
});

export default theme;