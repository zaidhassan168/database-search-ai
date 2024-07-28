import React from "react";
import {
    Box,
    Avatar,
    Typography,
    Paper,
    IconButton,
    useTheme,
    Zoom
} from "@mui/material";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CodeBlock } from '@atlaskit/code';

export const UserMessage = ({ text }: { text: string }) => {
    const theme = useTheme();
    return (
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Paper elevation={1} sx={{
                    padding: 2,
                    borderRadius: '20px 20px 5px 20px',
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    maxWidth: '80%',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="body1">{text}</Typography>
                </Paper>
            </Box>
        </Zoom>
    );
};

export const AssistantMessage = ({ text }: { text: string }) => {
    const theme = useTheme();
    return (
        <Zoom in={true}>
            <Box display="flex" mb={2}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1 }}>AI</Avatar>
                <Paper  sx={{
                    padding: 2,
                    // borderRadius: '20px 20px 20px 5px',
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    maxWidth: 'calc(100% - 48px)',
                    overflow: 'hidden',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    borderColor: theme.palette.divider,
                    borderWidth: '1px',
                }}>
                    <Markdown
                        components={{
                            code: ({ className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                    <Box sx={{ mt: 1, mb: 1 }}>
                                        <CodeBlock text={String(children).replace(/\n$/, '')} language="js" />
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

export const CodeMessage = ({ text }: { text: string }) => {
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