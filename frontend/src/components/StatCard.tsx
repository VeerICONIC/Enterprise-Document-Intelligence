import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";

import { getDashboardStats } from "../services/api";

interface DashboardStats {
  documents: number;
  pages: number;
  chunks: number;
  agents: number;
  vectorstore: string;
}

function StatCard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (!stats) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const cards = [
    {
      title: "Documents",
      value: stats.documents,
      subtitle: "PDFs Indexed",
      icon: <DescriptionRoundedIcon fontSize="large" />,
      color: "#2563EB",
    },
    {
      title: "Pages",
      value: stats.pages,
      subtitle: "Pages Processed",
      icon: <SmartToyRoundedIcon fontSize="large" />,
      color: "#10B981",
    },
    {
      title: "Chunks",
      value: stats.chunks,
      subtitle: "Stored in ChromaDB",
      icon: <HubRoundedIcon fontSize="large" />,
      color: "#F59E0B",
    },
    {
      title: "Vector Store",
      value: stats.vectorstore,
      subtitle: "ChromaDB",
      icon: <StorageRoundedIcon fontSize="large" />,
      color: "#8B5CF6",
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, lg: 3 }}
        >
          <Card
            sx={{
              bgcolor: "#1E293B",
              borderRadius: 4,
              height: 165,
              transition: "0.3s",
              border: "1px solid #334155",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-6px)",
                borderColor: card.color,
                boxShadow: `0 0 18px ${card.color}40`,
              },
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#94A3B8",
                    fontSize: 14,
                    mb: 1,
                  }}
                >
                  {card.title}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="white"
                >
                  {card.value}
                </Typography>

                <Typography
                  sx={{
                    color: "#64748B",
                    mt: 1,
                  }}
                >
                  {card.subtitle}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 62,
                  height: 62,
                  borderRadius: "18px",
                  bgcolor: card.color,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
              >
                {card.icon}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default StatCard;