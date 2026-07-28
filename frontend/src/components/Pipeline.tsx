import {
  Paper,
  Typography,
  Box,
} from "@mui/material";

import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";

const pipeline = [
  "Upload Document",
  "Text Chunking",
  "Generate Embeddings",
  "Store in ChromaDB",
  "Retrieve Context",
  "Generate Answer",
];

function Pipeline() {
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
        🧠 AI Pipeline
      </Typography>

      {pipeline.map((step, index) => (
        <Box
          key={step}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              bgcolor: "#2563EB",
              color: "white",
              px: 3,
              py: 1,
              borderRadius: 3,
              width: "100%",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {step}
          </Box>

          {index !== pipeline.length - 1 && (
            <ArrowDownwardRoundedIcon
              sx={{
                color: "#94A3B8",
                my: 1,
              }}
            />
          )}
        </Box>
      ))}
    </Paper>
  );
}

export default Pipeline;