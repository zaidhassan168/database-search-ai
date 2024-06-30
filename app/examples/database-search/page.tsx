"use client";
import React from "react";
import styles from "../shared/page.module.css";

import Chat from "../../components/chat";
import ConnectDatabase from "@/app/components/connect-database";
import DatabaseChat from "@/app/components/database-chat";
const FileSearchPage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.column}>
          <ConnectDatabase />
        </div>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <DatabaseChat />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FileSearchPage;
