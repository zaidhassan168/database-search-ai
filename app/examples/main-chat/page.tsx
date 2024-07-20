"use client"
import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Avatar,
    TextField,
    IconButton,
    Typography,
    Paper,
    useTheme,
    useMediaQuery,
    Drawer,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import 'highlight.js/styles/atom-one-dark.css';
import { AssistantStream } from "openai/lib/AssistantStream";
import { AssistantStreamEvent } from "openai/resources/beta/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { Sidebar } from "@/app/components/side-bar";
import { MessageList } from "@/app/components/message-list";
import { ChatInput } from "@/app/components/chat-input";

type MessageProps = {
    role: "user" | "assistant" | "code";
    text: string;
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
    const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const inputRef = useRef<HTMLInputElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };
    useEffect(() => {
        if (!isTyping && !inputDisabled) {
            inputRef.current?.focus();
        }
    }, [isTyping, inputDisabled]);
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
          const response = await fetch(`/api/assistants/threads/${threadId}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: text }),
          });
          const stream = AssistantStream.fromReadableStream(response.body);
          handleReadableStream(stream);
        } catch (error) {
          console.error('Failed to send message:', error);
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
        event: AssistantStreamEvent.ThreadRunRequiresAction
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
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={drawerOpen}
                onClose={toggleDrawer}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    width: drawerOpen ? { xs: 250, sm: 300 } : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: { xs: 250, sm: 300 },
                        boxSizing: 'border-box',
                        top: 0,
                        height: '100%',
                    },
                }}
            >
                <Sidebar toggleDrawer={toggleDrawer} />

            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleDrawer}
                        sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        AI Chat Assistant
                    </Typography>
                </Box>
                <MessageList messages={messages} isTyping={isTyping} />
                <ChatInput handleSubmit={handleSubmit} inputDisabled={inputDisabled} userInput={userInput} setUserInput={setUserInput} inputRef={inputRef} />
            </Box>
        </Box>
    );
};

export default Chat;
