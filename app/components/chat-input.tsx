import React from "react";
import { Box, TextField, IconButton, Paper, useTheme } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export const ChatInput = ({ userInput, setUserInput, handleSubmit, inputDisabled, inputRef }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 1,
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton color="primary" size="small" sx={{ mr: 1 }}>
                    <AttachFileIcon fontSize="small" />
                </IconButton>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={inputDisabled}
                    InputProps={{
                        sx: {
                            borderRadius: 1,
                            '& fieldset': {
                                borderColor: theme.palette.divider,
                                borderWidth: '1px',
                            },
                        },
                    }}
                    inputRef={inputRef}
                />
                <IconButton
                    type="submit"
                    color="primary"
                    disabled={inputDisabled}
                    size="small"
                    sx={{
                        ml: 1,
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </Box>
        </Paper>
    );
};
