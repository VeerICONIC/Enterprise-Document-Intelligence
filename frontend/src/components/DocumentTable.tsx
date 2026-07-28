import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";

import { getDocuments } from "../services/api";

interface Document {
  filename: string;
  uploaded_at: string;
  pages: number;
  chunks: number;
}

function DocumentTable() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const data = await getDocuments();
      setDocuments(data.documents);
    } catch (error) {
      console.error(error);
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
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        color="white"
        mb={3}
      >
        📄 Recent Documents
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          py={5}
        >
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
        <Typography color="#94A3B8">
          No documents uploaded yet.
        </Typography>
      ) : (
        documents.map((doc, index) => (
          <Box key={doc.filename}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.8,
              }}
            >
              <Box
                display="flex"
                gap={2}
                alignItems="center"
              >
                <PictureAsPdfRoundedIcon
                  sx={{ color: "#EF4444" }}
                />

                <Box>
                  <Typography
                    color="white"
                    fontWeight={500}
                  >
                    {doc.filename}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="#94A3B8"
                  >
                    {doc.pages} pages • {doc.chunks} chunks
                  </Typography>
                </Box>
              </Box>

              <Chip
                label="Indexed"
                color="success"
                size="small"
              />
            </Box>

            {index !== documents.length - 1 && (
              <Divider
                sx={{
                  borderColor: "#334155",
                }}
              />
            )}
          </Box>
        ))
      )}
    </Paper>
  );
}

export default DocumentTable;