import React from "react";
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
    useTheme
} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

type SidebarProps = {
    toggleDrawer: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ toggleDrawer }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: 250,
                [theme.breakpoints.up('sm')]: {
                    width: 300,
                },
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
            <List>
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
        </Box>
    );
};