import { Box, Typography, Avatar, Chip } from "@mui/material";

function Navbar() {
  return (
    <Box
      sx={{
        height: 72,
        bgcolor: "#111827",
        borderBottom: "1px solid #1F2937",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 4,
      }}
    >
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="white"
        >
          Enterprise AI Workspace
        </Typography>

        <Typography
          variant="body2"
          color="#94A3B8"
        >
          Multi-Agent Document Intelligence Platform
        </Typography>
      </Box>

      <Box display="flex" gap={3} alignItems="center">

        <Chip
          label="Online"
          color="success"
          variant="outlined"
        />

        <Typography color="white">
          Veer
        </Typography>

        <Avatar
          sx={{
            bgcolor: "#2563EB",
          }}
        >
          V
        </Avatar>

      </Box>
    </Box>
  );
}

export default Navbar;