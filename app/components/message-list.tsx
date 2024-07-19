import React from "react";
import { Box, Paper, CircularProgress, Fade, Avatar, useTheme } from "@mui/material";
import { UserMessage, AssistantMessage, CodeMessage } from "./messages";
import { keyframes } from '@emotion/react';

const pulseAnimation = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
`;

type MessageProps = {
    role: "user" | "assistant" | "code";
    text: string;
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

type MessageListProps = {
    messages: MessageProps[];
    isTyping: boolean;
};

export const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
    const theme = useTheme();
    const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Paper
            elevation={0}
            sx={{
                flexGrow: 1,
                overflowY: "auto",
                padding: 3,
                "&::-webkit-scrollbar": { width: 8 },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,.2)",
                    borderRadius: 8,
                },
            }}
        >
            {messages.map((msg, index) => (
                <Message key={index} role={msg.role} text={msg.text} />
            ))}
            {isTyping && (
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
    );
};