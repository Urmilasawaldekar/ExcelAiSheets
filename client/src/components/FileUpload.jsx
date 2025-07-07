import React, { useState } from "react";
import { Button, Snackbar, Alert, LinearProgress, Box, Typography, Paper } from "@mui/material";
import { FileSpreadsheet, Upload as UploadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("info");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const navigate = useNavigate();

  const showToast = (message, severity = "info") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      if (fileExtension === "xls" || fileExtension === "xlsx") {
        setFile(selectedFile);
        setUploadStatus("idle");
        setUploadSuccess(false);
      } else {
        showToast("Please upload an Excel file (.xls or .xlsx)", "error");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await response.json();

      setParsedData(result.data);
      setUploadProgress(100);
      setUploading(false);
      setUploadStatus("success");
      setUploadSuccess(true);
      showToast(`${file.name} has been uploaded successfully`, "success");

      setParsedData(result.data);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      // Removed automatic navigation to analysis page to rely on Analysis button navigation
      // navigate("/analysis", { state: { parsedData: result.data } });
    } catch (error) {
      setUploading(false);
      setUploadStatus("error");
      setUploadSuccess(false);
      showToast(error.message, "error");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const fileExtension = droppedFile.name.split(".").pop()?.toLowerCase();
      if (fileExtension === "xls" || fileExtension === "xlsx") {
        setFile(droppedFile);
        setUploadStatus("idle");
        setUploadSuccess(false);
      } else {
        showToast("Please upload an Excel file (.xls or .xlsx)", "error");
      }
    }
  };

  const goToAnalysis = () => {
    // Navigate to analysis page, pass parsedData if available, else fallback to uploadedFileName
    if (parsedData) {
      navigate("/analysis", { state: { parsedData } });
    } else {
      navigate("/analysis", { state: { uploadedFileName: file?.name } });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" gutterBottom>
        Upload Excel File
      </Typography>
      <Typography variant="body1" gutterBottom>
        Upload your Excel files for analysis and visualization
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 4,
          borderStyle: "dashed",
          textAlign: "center",
          cursor: "pointer",
          mb: 2,
          width: "100%",
          maxWidth: 400,
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            bgcolor: "primary.light",
            borderRadius: "50%",
            mx: "auto",
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FileSpreadsheet size={32} color="#1976d2" />
        </Box>
        <Typography variant="h6" gutterBottom>
          Drop your Excel file here
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supports .xls and .xlsx files up to 10MB
        </Typography>
        <input
          id="fileInput"
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Paper>

      {file && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, justifyContent: "center" }}>
          <FileSpreadsheet size={20} />
          <Typography variant="body2" color="text.secondary">
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </Typography>
        </Box>
      )}

      {file && !uploading && uploadStatus === "idle" && (
        <Button variant="contained" startIcon={<UploadIcon />} onClick={handleUpload} fullWidth>
          Upload File
        </Button>
      )}

      {uploading && (
        <Box sx={{ width: "100%", mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="text.secondary" align="center" mt={1}>
            Uploading... {uploadProgress}%
          </Typography>
        </Box>
      )}

      {uploadStatus === "success" && (
        <>
          <Typography variant="body1" color="success.main" align="center" mt={2}>
            Upload completed successfully!
          </Typography>
          <Button variant="contained" color="primary" onClick={goToAnalysis} sx={{ mt: 2 }}>
            Analysis
          </Button>
        </>
      )}

      {uploadStatus === "error" && (
        <Typography variant="body1" color="error.main" align="center" mt={2}>
          Upload failed. Please try again.
        </Typography>
      )}

      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={handleToastClose}>
        <Alert onClose={handleToastClose} severity={toastSeverity} sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileUpload;
