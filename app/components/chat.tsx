"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Box, 
  Avatar, 
  TextField, 
  IconButton, 
  Typography, 
  Paper, 
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom
} from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Markdown from "react-markdown";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { CodeBlock } from '@atlaskit/code';

import { AssistantStream } from "openai/lib/AssistantStream";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import OpenAI from "openai";
import { keyframes } from '@emotion/react';
import 'highlight.js/styles/atom-one-dark.css';

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
};

const pulseAnimation = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
`;


const UserMessage = ({ text }: { text: string }) => {
  const theme = useTheme();
  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Paper elevation={1} sx={{ 
          padding: 2, 
          borderRadius: '20px 20px 5px 20px', 
          bgcolor: theme.palette.primary.main, 
          color: 'white',
          maxWidth: '80%',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="body1">{text}</Typography>
        </Paper>
      </Box>
    </Zoom>
  );
};

const AssistantMessage = ({ text }: { text: string }) => {
  const theme = useTheme();
  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Box display="flex" mb={2}>
        <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1 }}>AI</Avatar>
        <Paper elevation={1} sx={{
          padding: 2,
          borderRadius: '20px 20px 20px 5px',
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          maxWidth: 'calc(100% - 48px)',
          overflow: 'hidden',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <Markdown
            components={{
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <CodeBlock text={String(children).replace(/\n$/, '')} language='js' />
                  </Box>
                ) : (
                  <code className={className} {...props}>{children}</code>
                );
              },
              p: ({ children }) => (
                <Typography variant="body1" sx={{ mb: 1 }}>{children}</Typography>
              ),
            }}
          >
            {text}
          </Markdown>
        </Paper>
      </Box>
    </Zoom>
  );
};

const CodeMessage = ({ text }: { text: string }) => {
  const theme = useTheme();
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Box display="flex" mb={2} sx={{ width: '100%' }}>
        <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 1 }}>{'</>'}</Avatar>
        <Paper elevation={1} sx={{ 
          padding: 2, 
          borderRadius: 2, 
          position: 'relative', 
          bgcolor: theme.palette.grey[900],
          maxWidth: 'calc(100% - 48px)',
          overflowX: 'auto',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle2" color="white">Code</Typography>
            <IconButton onClick={handleCopy} size="small" sx={{ color: 'white' }}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
          <SyntaxHighlighter 
            style={atomDark} 
            language="text"
            customStyle={{
              margin: 0,
              padding: '12px',
              borderRadius: '4px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            {text}
          </SyntaxHighlighter>
        </Paper>
      </Box>
    </Zoom>
  );
};

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    case "code":
      return <CodeMessage text={text} />;
    default:
      return null;
  }
};

type ChatProps = {
  functionCallHandler?: (toolCall: RequiredActionFunctionToolCall) => Promise<string>;
};

const Chat = ({ functionCallHandler = () => Promise.resolve("") }: ChatProps) => {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [threadId, setThreadId] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const createThread = async () => {
      try {
        const res = await fetch(`/api/assistants/threads`, { method: "POST" });
        const data = await res.json();
        setThreadId(data.threadId);
      } catch (error) {
        console.error("Failed to create thread:", error);
      }
    };
    createThread();
  }, []);


  const sendMessage = async (text: string) => {
    try {
      setIsTyping(true);
      const response = await fetch(
        `/api/assistants/threads/${threadId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content: text }),
        }
      );
      const stream = AssistantStream.fromReadableStream(response.body);
      handleReadableStream(stream);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const submitActionResult = async (runId: string, toolCallOutputs: any[]) => {
    try {
      setIsTyping(true);
      const response = await fetch(
        `/api/assistants/threads/${threadId}/actions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ runId, toolCallOutputs }),
        }
      );
      const stream = AssistantStream.fromReadableStream(response.body);
      handleReadableStream(stream);
    } catch (error) {
      console.error("Failed to submit action result:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    sendMessage(userInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  const handleTextCreated = () => {
    appendMessage("assistant", "");
  };

  const handleTextDelta = (delta: any) => {
    if (delta.value != null) appendToLastMessage(delta.value);
    if (delta.annotations != null) annotateLastMessage(delta.annotations);
  };

  const handleImageFileDone = (image: any) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  };

  const toolCallCreated = (toolCall: any) => {
    if (toolCall.type !== "code_interpreter") return;
    appendMessage("code", "");
  };

  const toolCallDelta = (delta: any, snapshot: any) => {
    if (delta.type !== "code_interpreter") return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  const handleRequiresAction = async (
    event: OpenAI.Beta.AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;

    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );

    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  const handleRunCompleted = () => {
    setInputDisabled(false);
  };

  const handleReadableStream = (stream: AssistantStream) => {
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);
    stream.on("imageFileDone", handleImageFileDone);
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);

    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };

  const appendToLastMessage = (text: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role: "user" | "assistant" | "code", text: string) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const annotateLastMessage = (annotations: any[]) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      let updatedText = lastMessage.text;

      annotations.forEach((annotation) => {
        if (annotation.type === "file_path") {
          updatedText = updatedText.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`
          );
        }
      });

      const updatedLastMessage = { ...lastMessage, text: updatedText };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)", // Modern gradient
        fontFamily: "Open Sans, sans-serif", // Clean font
      }}
    >
      <Paper // Chat message area
        elevation={0}
        sx={{
          flexGrow: 1,
          overflow: "auto",
          padding: 3,
          "&::-webkit-scrollbar": { width: 8 }, // Improved scrollbar style
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.2)",
            borderRadius: 8,
          },
        }}
      >
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        {isTyping && ( // Typing indicator animation
          <Fade in={isTyping}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  mr: 1,
                  width: 30,
                  height: 30,
                }}
              >
                {/* You can replace this with a custom AI logo */}
                AI
              </Avatar>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  p: 1,
                  bgcolor: theme.palette.background.paper,
                  borderRadius: "10px",
                  animation: `${pulseAnimation} 1.5s infinite`,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <CircularProgress
                    key={i}
                    size={8}
                    sx={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </Box>
            </Box>
          </Fade>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      <Paper // Input area
        elevation={3}
        sx={{
          padding: 2,
          borderTop: `1px solid #e0e0e0`, 
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="primary" sx={{ mr: 1 }}>
              <AttachFileIcon />
            </IconButton>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={inputDisabled}
              InputProps={{
                sx: { borderRadius: 20 }, // Rounded input
              }}
            />
            <IconButton 
              type="submit"
              color="primary"
              disabled={inputDisabled}
              sx={{
                borderRadius: '50%',
                width: 48,
                height: 48,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
      </Paper>
    </Box>
  );
};

export default Chat;