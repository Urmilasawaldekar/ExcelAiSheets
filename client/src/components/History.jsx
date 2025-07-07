// Add import for useNavigate at the top
import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Button, Snackbar, Alert } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [fileHistory, setFileHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user upload history from backend API
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/history', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Transform data into array for table display
            const files = result.data.map((file) => ({
              id: file.id,
              name: file.displayName,
              filename: file.filename,
              records: file.sheetsData ? Object.values(file.sheetsData).reduce((acc, sheet) => acc + (sheet ? sheet.length : 0), 0) : 0,
              fileMissing: file.fileMissing,
              uploadDate: file.uploadDate || 'N/A',
            }));
            setFileHistory(files);
          }
        }
      } catch (error) {
        console.error('Failed to fetch upload history:', error);
      }
    };
    fetchHistory();
  }, []);

  // Filter out files marked as missing
  const filteredFiles = fileHistory
    .filter(file => !file.fileMissing)
    .filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handlePreview = (fileName) => {
    // Navigate to analysis page with selected file data
    if (fileHistory.length > 0) {
      const fileData = fileHistory.find(file => file.name === fileName);
      if (fileData) {
        // Assuming you have a way to get parsed data for the file
        // For now, navigate with file name in state
        navigate('/analysis', { state: { selectedFileName: fileName } });
      }
    }
  };

  const handleStatusClose = () => {
    setStatusOpen(false);
  };

  // Show status message for file upload success
  useEffect(() => {
    // This is a placeholder: you can set statusMessage and statusOpen from props or context
    // For demonstration, show a message for 3 seconds on mount
    setStatusMessage('File upload successful');
    setStatusOpen(true);
    const timer = setTimeout(() => {
      setStatusOpen(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        History
      </Typography>
      <Typography variant="body1" gutterBottom>
        View and manage your uploaded Excel files
      </Typography>

      <Snackbar open={statusOpen} autoHideDuration={3000} onClose={handleStatusClose}>
        <Alert onClose={handleStatusClose} severity="success" sx={{ width: '100%' }}>
          {statusMessage}
        </Alert>
      </Snackbar>

      <Card sx={{ mt: 3 }}>
        <CardHeader title="Uploaded Files" />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>Records</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      {file.fileMissing ? (
                        <span style={{ color: 'red' }}>{file.name}</span>
                      ) : (
                        file.name
                      )}
                    </TableCell>
                    <TableCell>{file.records}</TableCell>
                    <TableCell><span style={{ color: 'green', fontWeight: 'bold' }}>Uploaded Successfully</span></TableCell>
                    <TableCell>
                   
                     
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
                            try {
                              const response = await fetch(`http://localhost:3000/api/delete/${file.filename}`, {
                                method: 'DELETE',
                                credentials: 'include',
                              });
                              if (response.ok) {
                                setFileHistory((prev) => prev.filter((f) => f.id !== file.id));
                                setStatusMessage('File deleted successfully');
                                setStatusOpen(true);
                              } else {
                                setStatusMessage('Failed to delete file');
                                setStatusOpen(true);
                              }
                            } catch (error) {
                              setStatusMessage('Error deleting file');
                              setStatusOpen(true);
                            }
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No files found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
};

export default History;

