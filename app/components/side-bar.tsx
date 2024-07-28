import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider,
    IconButton,
    useTheme,
    Button,
    CircularProgress,
    ListItemSecondaryAction
} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';

type SidebarProps = {
    toggleDrawer: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ toggleDrawer }) => {
    const theme = useTheme();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        const resp = await fetch("/api/assistants/files", {
            method: "GET",
        });
        const data = await resp.json();
        setFiles(data);
        setLoading(false);
    };

    const handleFileDelete = async (fileId) => {
        setLoading(true);
        await fetch("/api/assistants/files", {
            method: "DELETE",
            body: JSON.stringify({ fileId }),
        });
        await fetchFiles();
    };

    const handleFileUpload = async (event) => {
        const data = new FormData();
        if (event.target.files.length < 1) return;
        data.append("file", event.target.files[0]);
        setLoading(true);
        await fetch("/api/assistants/files", {
            method: "POST",
            body: data,
        });
        await fetchFiles();
    };

    return (
        <Box
            sx={{
                width: 250,
                [theme.breakpoints.up('sm')]: {
                    width: 300,
                },
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
            role="presentation"
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                <Typography variant="h6">Chat with AI</Typography>
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </Box>
            <Divider />
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                <ListItem button>
                    <ListItemAvatar>
                        <Avatar>AI</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Acme Inc" secondary="Discussing new product ideas" />
                </ListItem>
                <ListItem button>
                    <ListItemAvatar>
                        <Avatar>JD</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="John Doe" secondary="Troubleshooting technical issue" />
                </ListItem>
                <ListItem button>
                    <ListItemAvatar>
                        <Avatar>SA</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Sarah Adams" secondary="Discussing marketing strategy" />
                </ListItem>
            </List>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1">Files</Typography>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : files.length === 0 ? (
                    <Typography variant="body2" sx={{ my: 2 }}>No files attached</Typography>
                ) : (
                    <List dense>
                        {files.map((file) => (
                            <ListItem key={file.file_id}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <AttachFileIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={file.filename} 
                                    secondary={file.status}
                                    primaryTypographyProps={{ noWrap: true }}
                                    secondaryTypographyProps={{ noWrap: true }}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleFileDelete(file.file_id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                )}
                <Box sx={{ mt: 2 }}>
                    <input
                        accept="*/*"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        multiple
                        type="file"
                        onChange={handleFileUpload}
                    />
                    <label htmlFor="raised-button-file">
                        <Button variant="outlined" component="span" startIcon={<AttachFileIcon />} fullWidth>
                            Attach File
                        </Button>
                    </label>
                </Box>
            </Box>
        </Box>
    );
};
