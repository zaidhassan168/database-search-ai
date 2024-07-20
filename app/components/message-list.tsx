import React from "react";
import { Box, Typography, Avatar, useTheme } from "@mui/material";
import { UserMessage, AssistantMessage, CodeMessage } from "./messages";
import { keyframes } from '@emotion/react';

const fadeInAnimation = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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
    // console.log(messages);
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Box
            sx={{
                flexGrow: 1,
                overflowY: "auto",
                padding: 3,
                "&::-webkit-scrollbar": { width: 8 },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,.1)",
                    borderRadius: 8,
                },
            }}
        >
            {messages.map((msg, index) => (
                <Box key={index} sx={{ mb: 2, animation: `${fadeInAnimation} 0.3s ease-out` }}>
                    <Message role={msg.role} text={msg.text} />
                </Box>
            ))}
            {isTyping && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            mr: 1,
                            width: 30,
                            height: 30,
                        }}
                    >
                        AI
                    </Avatar>
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                            animation: `${fadeInAnimation} 1s infinite alternate`,
                        }}
                    >
                        Thinking...
                    </Typography>
                </Box>
            )}
            <div ref={messagesEndRef} />
        </Box>
    );
};
