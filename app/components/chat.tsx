"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Avatar, TextField, Button, Typography, Paper, IconButton, CircularProgress } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Markdown from "react-markdown";
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { AssistantStream } from "openai/lib/AssistantStream";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import OpenAI from "openai";
import { Components } from 'react-markdown';
import { keyframes } from '@emotion/react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
};

const slideUp = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;


const UserMessage = ({ text }: { text: string }) => (
  <Box display="flex" mb={3} sx={{ animation: `${slideUp} 0.5s ease` }}>
    <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>👤</Avatar>
    <Paper elevation={2} sx={{ 
      padding: 2, 
      marginLeft: 2, 
      borderRadius: '20px 20px 20px 5px', 
      bgcolor: 'primary.light', 
      color: 'white',
      maxWidth: '80%'
    }}>
      <Typography>{text}</Typography>
    </Paper>
  </Box>
);

interface AssistantMessageProps {
  text: string;
}

interface CodeProps {
  className?: string;
  children: React.ReactNode;
}
const AssistantMessage: React.FC<AssistantMessageProps> = ({ text }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightBlock(codeRef.current);
    }
  }, [text]);
  return(
  <Box display="flex" mb={3} sx={{ animation: `${slideUp} 0.5s ease` }}>
    <Avatar sx={{ bgcolor: 'success.main', color: 'white', alignSelf: 'flex-start' }}>🤖</Avatar>
    <Paper
      elevation={2}
      sx={{
        padding: 2,
        marginLeft: 2,
        borderRadius: '5px 20px 20px 20px',
        bgcolor: 'success.light',
        color: 'white',
        maxWidth: 'calc(100% - 48px)', // Adjust based on Avatar size
        overflow: 'hidden', // Ensures no overflow in any direction
        boxSizing: 'border-box', // Include padding and border in the element's total width and height
      }}
    >
      <Markdown
        components={{
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !match ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <Box > {/* Remove negative margins */}
                {/* <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter> */}
              <SyntaxHighlighter
              style={atomDark}
              customStyle={{

                fontSize: '0.6em',
              }}
              language={match[1]}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
              </Box>
            );
          },
          p: ({ children }) => (
            <Typography component="p" sx={{ mb: 1 }}>
              {children}
            </Typography>
          ),
        }}
      >
        {text}
      </Markdown>
    </Paper>
  </Box>
)}

const CodeMessage = ({ text }: { text: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box display="flex" mb={3} sx={{ animation: `${slideUp} 0.5s ease`, width: '100%' }}>
      <Avatar sx={{ bgcolor: 'info.main', color: 'white', flexShrink: 0 }}>💻</Avatar>
      <Paper 
        elevation={2} 
        sx={{ 
          padding: 2, 
          marginLeft: 2, 
          borderRadius: 2, 
          position: 'relative', 
          bgcolor: 'info.light', 
          color: 'white',
          maxWidth: 'calc(100% - 48px)',
          overflowX: 'auto'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1">Code</Typography>
          <IconButton onClick={handleCopy} color="inherit" size="small">
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
        <SyntaxHighlighter 
          style={atomDark} 
          language="text"
          customStyle={{
            margin: 0,
            padding: '12px',
            borderRadius: '8px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {text}
        </SyntaxHighlighter>
      </Paper>
    </Box>
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
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""),
}: ChatProps) => {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [threadId, setThreadId] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const createThread = async () => {
      try {
        const res = await fetch(`/api/assistants/threads`, {
          method: "POST",
        });
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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      p: 3, 
      bgcolor: '#f0f4f8'
    }}>
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', // This allows scrolling
        mb: 3, 
        p: 3, 
        bgcolor: 'white', 
        borderRadius: 3,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        {isTyping && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', borderRadius: 2, p: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your question"
          disabled={inputDisabled}
          sx={{ mr: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={inputDisabled}>
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
