import React from "react";
import { Box, TextField, IconButton, Paper, useTheme } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

type ChatInputProps = {
    userInput: string;
    setUserInput: (input: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    inputDisabled: boolean;
};

export const ChatInput: React.FC<ChatInputProps> = ({ userInput, setUserInput, handleSubmit, inputDisabled }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
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
                        sx: { borderRadius: 20 },
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
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                            bgcolor: theme.palette.primary.dark,
                        },
                        ml: 1,
                    }}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    );
};