import {
  Paper,
  Typography,
  Box,
  Chip,
} from "@mui/material";

const services = [
  {
    name: "FastAPI Server",
    status: "Online",
  },
  {
    name: "Ollama LLM",
    status: "Online",
  },
  {
    name: "ChromaDB",
    status: "Connected",
  },
  {
    name: "LangGraph Router",
    status: "Running",
  },
];

function BackendHealth() {
  return (
    <Paper
      sx={{
        bgcolor: "#1E293B",
        borderRadius: 4,
        border: "1px solid #334155",
        p: 3,
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        color="white"
        mb={3}
      >
        ⚙ Backend Health
      </Typography>

      {services.map((service) => (
        <Box
          key={service.name}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1.5,
          }}
        >
          <Typography color="white">
            {service.name}
          </Typography>

          <Chip
            label={service.status}
            color="success"
            size="small"
          />
        </Box>
      ))}
    </Paper>
  );
}

export default BackendHealth;