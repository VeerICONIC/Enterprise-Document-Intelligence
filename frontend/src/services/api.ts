import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export default api;

// -----------------------------
// Upload PDF
// -----------------------------
export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

// -----------------------------
// Ask AI
// -----------------------------
export async function askQuestion(question: string) {
  const response = await api.post("/query", {
    question,
  });

  return response.data;
}

// -----------------------------
// Get Documents
// -----------------------------
export async function getDocuments() {
  const response = await api.get("/documents");
  return response.data;
}

// -----------------------------
// Health
// -----------------------------
export async function getHealth() {
  const response = await api.get("/health");
  return response.data;
}

// -----------------------------
// Dashboard Stats
// -----------------------------

export async function getDashboardStats() {
  const response = await api.get("/dashboard");
  return response.data;
}