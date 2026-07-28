import { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Divider,
  Chip,
  Grid,
} from "@mui/material";

import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

import { askQuestion } from "../services/api";

interface Source {
  document: string;
  page: number;
}

interface Analytics {
  response_time: number;
  retrieved_chunks: number;
  documents_used: string[];
  documents_count: number;
  sources_count: number;
}

interface Metadata {
  agent: string;
  validation: string;
  rewritten_query: string;
}

function ChatWindow() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;

    try {
      setLoading(true);

      const response = await askQuestion(question);

      setAnswer(response.answer);
      setSources(response.sources);
      setAnalytics(response.analytics);
      setMetadata(response.metadata);
    } catch (err) {
      console.error(err);

      setAnswer("Something went wrong while querying the AI.");

      setSources([]);
      setAnalytics(null);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper
      sx={{
        bgcolor: "#1E293B",
        borderRadius: 4,
        border: "1px solid #334155",
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={2}
      >
        <SmartToyRoundedIcon sx={{ color: "#60A5FA" }} />

        <Typography
          variant="h6"
          color="white"
          fontWeight="bold"
        >
          AI Assistant
        </Typography>
      </Box>

      <Typography color="#94A3B8" mb={2}>
        Ask anything about your uploaded documents.
      </Typography>

      <TextField
        multiline
        rows={3}
        fullWidth
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Example: Summarise the annual report..."
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            color: "white",
            bgcolor: "#111827",
          },
        }}
      />

      <Button
        variant="contained"
        onClick={handleAsk}
        disabled={loading}
        sx={{
          alignSelf: "flex-end",
          mb: 3,
          textTransform: "none",
        }}
      >
        {loading ? (
          <CircularProgress
            size={22}
            color="inherit"
          />
        ) : (
          "Ask AI"
        )}
      </Button>

      <Divider
        sx={{
          borderColor: "#334155",
          mb: 2,
        }}
      />

      <Typography
        variant="subtitle1"
        color="white"
        fontWeight="bold"
      >
        🤖 AI Response
      </Typography>

      <Box
        sx={{
          mt: 2,
          bgcolor: "#111827",
          borderRadius: 3,
          p: 2,
        }}
      >
        <Typography
          color="#E2E8F0"
          whiteSpace="pre-wrap"
        >
          {answer || "Ask a question to see the response."}
        </Typography>
      </Box>

      {analytics && metadata && (
        <>
          <Divider
            sx={{
              my: 3,
              borderColor: "#334155",
            }}
          />

          <Typography
            color="white"
            fontWeight="bold"
            mb={2}
          >
            ⚡ AI Insights
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Typography color="#94A3B8">
                Response Time
              </Typography>

              <Typography color="white">
                {analytics.response_time} sec
              </Typography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Typography color="#94A3B8">
                Retrieved Chunks
              </Typography>

              <Typography color="white">
                {analytics.retrieved_chunks}
              </Typography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Typography color="#94A3B8">
                Documents Used
              </Typography>

              <Typography color="white">
                {analytics.documents_count}
              </Typography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Typography color="#94A3B8">
                Agent
              </Typography>

              <Typography color="white">
                {metadata.agent}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography color="#94A3B8">
                Validation
              </Typography>

              <Typography color="white">
                {metadata.validation}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}

      {sources.length > 0 && (
        <>
          <Divider
            sx={{
              my: 3,
              borderColor: "#334155",
            }}
          />

          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mb={2}
          >
            <DescriptionRoundedIcon
              sx={{ color: "#60A5FA" }}
            />

            <Typography
              color="white"
              fontWeight="bold"
            >
              Source Documents
            </Typography>
          </Box>

          <Box
            display="flex"
            gap={1}
            flexWrap="wrap"
          >
            {sources.map((source, index) => (
              <Chip
                key={index}
                label={`${source.document} (Page ${source.page})`}
                color="primary"
              />
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
}

export default ChatWindow;