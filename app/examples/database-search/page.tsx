"use client";
import React, { useState } from 'react';
import styles from "../shared/page.module.css";
import ConnectDatabase from "@/app/components/connect-database";
import DatabaseChat from "@/app/components/database-chat";
import { Button, Modal } from '@mui/material';

const DatabaseSearchPage = () => {
  const [showConnectDatabase, setShowConnectDatabase] = useState(false);


  const toggleConnectDatabase = () => {
    setShowConnectDatabase(!showConnectDatabase);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Button onClick={toggleConnectDatabase}
          sx={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            marginBottom: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '4px',
            backgroundColor: 'black',
          }}
          variant="contained"
        >
          {showConnectDatabase ? "close" : "Connect Database"}
        </Button>
        <Modal open={showConnectDatabase} onClose={toggleConnectDatabase}>
          <ConnectDatabase />
        </Modal>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <DatabaseChat />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DatabaseSearchPage;
