import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

const ConnectDatabase = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [settings, setSettings] = useState({
    name: "",
    model: "gpt-4",
    data_source_type: "postgres",
    data_source_connection_args: {
      url: "",
    },
    description: "",
  });

  const parsePostgresUrl = (url) => {
    const regex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
    const matches = url.match(regex);
    if (matches) {
      const [_, user, password, host, port, database] = matches;
      return { user, password, host, port, database };
    }
    throw new Error("Invalid PostgreSQL URL");
  };

  const handleConnectDatabase = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFlashMessage(null);

    // Check if required fields are filled
    if (!settings.name || !settings.model || !settings.data_source_connection_args.url) {
      setFlashMessage({ type: 'error', message: 'Please fill in all required fields.' });
      setIsLoading(false);
      return;
    }

    try {
      const { user, password, host, port, database } = parsePostgresUrl(
        settings.data_source_connection_args.url
      );

      const headers = {
        "Content-Type": "application/json",
        Authorization:
          "Bearer dffec46170bdcfaff7919631f3ebd99edeadd7c0f25c4a50f12a4d5d2407fc2b", // Replace with your actual API key
      };

      const response = await fetch("https://llm.mdb.ai/minds", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          ...settings,
          data_source_connection_args: {
            user,
            password,
            host,
            port,
            database,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFlashMessage({ type: 'success', message: `Success: ${JSON.stringify(data)}` });
        // onDatabaseData(data);
      } else {
        const errorData = await response.json();
        setFlashMessage({ type: 'error', message: `Error: ${errorData.detail.title}: ${errorData.detail.detail}` });
      }
    } catch (error) {
      setFlashMessage({ type: 'error', message: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        maxWidth: 500,
        margin: "auto",
        marginTop: 8,
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 2 }}
      >
        Connect to Database
      </Typography>
      <Box
        sx={{
          maxHeight: 500,
          overflowY: "auto",
          paddingRight: 1,
          "::-webkit-scrollbar": { display: "none" },
        }}
      >
        <form onSubmit={handleConnectDatabase}>
          <TextField
            label="Agent Name"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Model to be used"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Data Source Type i.e. postgres"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSettings({ ...settings, data_source_type: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="PostgreSQL URL"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={(e) =>
              setSettings({
                ...settings,
                data_source_connection_args: {
                  url: e.target.value,
                },
              })
            }
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description (optional)"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSettings({ ...settings, description: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{
              marginTop: 2,
              backgroundColor: "#3f51b5",
              "&:hover": {
                backgroundColor: "#283593",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Connect Database"
            )}
          </Button>
        </form>
      </Box>
      <Snackbar
        open={!!flashMessage}
        autoHideDuration={6000}
        onClose={() => setFlashMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setFlashMessage(null)}
          severity={flashMessage?.type}
          sx={{ width: '100%' }}
        >
          {flashMessage?.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ConnectDatabase;
