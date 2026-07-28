import { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Paper,
  Button,
  Box,
  LinearProgress,
  CircularProgress,
  Alert,
  Snackbar,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

import { useDropzone } from "react-dropzone";

import {
  uploadDocument,
  getDocuments,
} from "../services/api";

interface Document {
  filename: string;
  uploaded_at: string;
  pages: number;
  chunks: number;
}

function Documents() {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [documents, setDocuments] = useState<Document[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [snackbar, setSnackbar] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const data = await getDocuments();
      setDocuments(data.documents);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpload() {

    if (!selectedFile) return;

    try {

      setLoading(true);

      setProgress(20);

      await new Promise((r) => setTimeout(r, 250));

      setProgress(45);

      await uploadDocument(selectedFile);

      setProgress(80);

      await loadDocuments();

      setProgress(100);

      setSnackbar(true);

      setSelectedFile(null);

      setTimeout(() => {
        setProgress(0);
      }, 1200);

    } finally {

      setLoading(false);

    }
  }

  async function handleDelete(filename: string) {

    const confirmDelete = window.confirm(
      `Delete "${filename}" ?`
    );

    if (!confirmDelete) return;

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/documents/${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {

        throw new Error("Delete Failed");

      }

      await loadDocuments();

  }

  catch (err) {

    console.error(err);

    alert("Unable to delete document.");

  }

 }

  const filteredDocuments = useMemo(() => {

    return documents.filter((doc) =>
      doc.filename
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [documents, search]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {

      if (acceptedFiles.length > 0) {

        setSelectedFile(acceptedFiles[0]);

      }

    },
  });

  return (
    <>

      <Typography
        variant="h4"
        color="white"
        fontWeight="bold"
        mb={4}
      >
        Documents
      </Typography>

      {/* Upload */}

      <Paper
        sx={{
          p: 5,
          mb: 4,
          bgcolor: "#1E293B",
          borderRadius: 4,
          border: isDragActive
            ? "2px solid #3B82F6"
            : "2px dashed #475569",
          textAlign: "center",
          transition: "0.3s",
          cursor: "pointer",
        }}
      >

        <Box {...getRootProps()}>

          <input {...getInputProps()} />

          <CloudUploadRoundedIcon
            sx={{
              fontSize: 70,
              color: "#3B82F6",
            }}
          />

          <Typography
            variant="h5"
            color="white"
            mt={2}
          >
            {isDragActive
              ? "Drop PDF Here"
              : "Drag & Drop PDF"}
          </Typography>

          <Typography color="#94A3B8">

            Click anywhere to browse

          </Typography>

        </Box>

        {selectedFile && (

          <Box mt={4}>

            <Typography
              color="#60A5FA"
              fontWeight="bold"
            >
              📄 {selectedFile.name}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
              onClick={handleUpload}
            >
              {loading ? (
                <CircularProgress
                  size={22}
                  color="inherit"
                />
              ) : (
                "Upload"
              )}
            </Button>

          </Box>

        )}

        {loading && (

          <Box mt={4}>

            <LinearProgress
              variant="determinate"
              value={progress}
            />

          </Box>

        )}

      </Paper>

      {/* Search */}

      <TextField

        fullWidth

        value={search}

        onChange={(e) =>
          setSearch(e.target.value)
        }

        placeholder="Search uploaded documents..."

        InputProps={{
          startAdornment: (
            <SearchRoundedIcon
              sx={{
                mr: 1,
                color: "#94A3B8",
              }}
            />
          ),
        }}

        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            color: "white",
            bgcolor: "#1E293B",
          },
        }}

      />

      <Typography
        color="#94A3B8"
        mb={2}
      >
        Total Documents : {filteredDocuments.length}
      </Typography>

      <Grid container spacing={3}>

        {filteredDocuments.length === 0 ? (

          <Grid size={{ xs: 12 }}>

            <Paper
              sx={{
                bgcolor: "#1E293B",
                p: 5,
                textAlign: "center",
              }}
            >

              <PictureAsPdfRoundedIcon
                sx={{
                  fontSize: 70,
                  color: "#475569",
                }}
              />

              <Typography
                color="#94A3B8"
                mt={2}
              >
                No Documents Found
              </Typography>

            </Paper>

          </Grid>

        ) : (

          filteredDocuments.map((doc) => (

            <Grid
              key={doc.filename}
              size={{
                xs: 12,
                md: 6,
                lg: 4,
              }}
            >

              <Card
                sx={{
                  bgcolor: "#1E293B",
                  borderRadius: 4,
                  height: "100%",
                  border: "1px solid #334155",
                }}
              >

                <CardContent>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >

                    <Typography
                      color="white"
                      fontWeight="bold"
                    >
                      {doc.filename}
                    </Typography>

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >

                        <Chip
                          label="Indexed"
                          color="success"
                          size="small"
                        />

                        <IconButton
                          color="error"
                          onClick={() => handleDelete(doc.filename)}
                        >
                          <DeleteIcon />
                        </IconButton>

                      </Box>

                </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    mt={3}
                    gap={1}
                  >

                    <CalendarMonthRoundedIcon
                      sx={{
                        color: "#60A5FA",
                        fontSize: 20,
                      }}
                    />

                    <Typography color="#94A3B8">

                      {doc.uploaded_at}

                    </Typography>

                  </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    mt={2}
                    gap={1}
                  >

                    <DescriptionRoundedIcon
                      sx={{
                        color: "#60A5FA",
                        fontSize: 20,
                      }}
                    />

                    <Typography color="#CBD5E1">

                      {doc.pages} Pages

                    </Typography>

                  </Box>

                  <Typography
                    color="#CBD5E1"
                    mt={1}
                  >

                    {doc.chunks} Chunks

                  </Typography>

                </CardContent>

              </Card>

            </Grid>

          ))

        )}

      </Grid>

      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
      >

        <Alert severity="success">

          Document Indexed Successfully

        </Alert>

      </Snackbar>

    </>
  );
}

export default Documents;