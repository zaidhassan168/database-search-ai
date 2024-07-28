import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  CircularProgress,
  Paper,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import StorageIcon from '@mui/icons-material/Storage';
import Markdown from "react-markdown";

const DatabaseChat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [agentName, setAgentName] = useState("");
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    setIsLoading(true);
    const newUserMessage = { role: "user", content: text };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    const requestData = {
      model: agentName || "gpt-3.5-turbo",
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Analyze the data and maintain conversation context.',
        },
        ...messages,
        newUserMessage,
      ],
    };

    try {
      console.log(requestData);
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = { role: "assistant", content: data.choices[0].message.content };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [...prevMessages, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    sendMessage(userInput);
    setUserInput("");
  };


  const Message = ({ role, content }) => {
    const isUser = role === "user";
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2,
            maxWidth: '70%',
            backgroundColor: isUser ? '#e3f2fd' : '#f5f5f5',
            borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
          }}
        >
          <Typography variant="body1">
            {role === "assistant" ? (
              <Markdown>{content}</Markdown>
            ) : (
              content
            )}
          </Typography>
        </Paper>
      </Box>
    );
  };


  return (
    <Paper 
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: isMobile ? '100%' : '800px',
        height: 'calc(100vh - 32px)', // Adjust for some padding
        mx: 'auto',
        mt: 2,
        mb: 2,
        p: 3,
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <StorageIcon sx={{ fontSize: 40, mr: 2, color: '#1976d2' }} />
        <Typography variant="h4" component="h1">
          Database Chat
        </Typography>
      </Box>

      <TextField
        label="Agent Name"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setAgentName(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Paper 
        elevation={1}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          mb: 2,
          backgroundColor: '#ffffff',
        }}
      >
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your question"
          disabled={isLoading}
          sx={{ 
            mr: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black',
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
            '& .MuiInputBase-input': {
              color: 'black',
            },
          }}
        />
        <IconButton 
          type="submit"
          disabled={isLoading}
          sx={{ 
            p: '10px',
            backgroundColor: '#1976d2',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SendIcon />
          )}
        </IconButton>
      </form>
    </Paper>
  );
};


export default DatabaseChat;