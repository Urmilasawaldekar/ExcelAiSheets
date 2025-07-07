import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import { addMessage, clearMessages } from '../redux/chatSlice';

const AIInsight = () => {
  const dispatch = useDispatch();
  const chatMessages = useSelector((state) => state.chat.messages);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    setSelectedFileName(file.name);
    dispatch(clearMessages());
    setChatError('');
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    setChatError('');
    dispatch(addMessage({ sender: 'user', text: chatInput }));
    try {
      const token = localStorage.getItem('token');
      const contextData = uploadedFile ? { filename: uploadedFile.name } : null;
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ message: chatInput, contextData }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to get chat response');
      }
      const result = await response.json();
      dispatch(addMessage({ sender: 'ai', text: result.response }));
      setChatInput('');
    } catch (err) {
      setChatError(err.message);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto',  textAlign:'center'}}>
      <Typography variant="h4" gutterBottom>
        AI Insight Chatbot
      </Typography>

      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Upload File (PDF, Image, Excel, JSON)
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {selectedFileName && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Selected file: {selectedFileName}
        </Typography>
      )}

      <Paper>
        {chatMessages.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Start chatting by typing a message below.
          </Typography>
        )}
        <List>
          {chatMessages.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Paper sx={{ p: 1, bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.300', maxWidth: '70%' }}>
                <ListItemText primary={msg.text} />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Paper>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message here..."
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChatSend();
          }
        }}
        disabled={chatLoading}
        multiline
        minRows={1}
        maxRows={4}
        sx={{ mb: 1 }}
      />
      <Button variant="contained" onClick={handleChatSend} disabled={chatLoading || !chatInput.trim()}>
        Send
      </Button>
      {chatLoading && <CircularProgress size={24} sx={{ ml: 2, mt: 1 }} />}
      {chatError && (
        <Typography color="error" sx={{ mt: 1 }}>
          {chatError}
        </Typography>
      )}
    </Box>
  );
};

export default AIInsight;
