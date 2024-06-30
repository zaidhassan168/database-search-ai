import React, { useState } from "react";
import formStyles from "./input.module.css";
const ConnectDatabase = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [mindName, setMindName] = useState<string>('');

  const [settings, setSettings] = useState({
    name: '',
    model: 'gpt-4',
    data_source_type: 'postgres',
    data_source_connection_args: {
      user: '',
      password: '',
      host: '',
      port: '',
      database: '',
      schema: '',
    },
    description: '',
  });

  const handleConnectDatabase = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setIsLoading(true);
    setResponseMessage(null);

    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer dffec46170bdcfaff7919631f3ebd99edeadd7c0f25c4a50f12a4d5d2407fc2b', // Replace with your actual API key
      };

      const response = await fetch("https://llm.mdb.ai/minds", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(`Success: ${JSON.stringify(data)}`);
      } else {
        const errorData = await response.json();
        setResponseMessage(`Error: ${errorData.detail.title}: ${errorData.detail.detail}`);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMindNameSubmit = async (e) => {
    e.preventDefault();
    console.log("Mind Name Submitted:", mindName);
    // Handle mind name submission logic here
  };

  return (
    <div className={formStyles.formContainer}>
      <form onSubmit={handleConnectDatabase}>
        <input type="text" placeholder="Name" onChange={(e) => setSettings({...settings, name: e.target.value})} />
        <input type="text" placeholder="Model" onChange={(e) => setSettings({...settings, model: e.target.value})} />
        <input type="text" placeholder="Data Source Type" onChange={(e) => setSettings({...settings, data_source_type: e.target.value})} />
        <input type="text" placeholder="User" onChange={(e) => setSettings({...settings, data_source_connection_args: {...settings.data_source_connection_args, user: e.target.value}})} />
        <input type="text" placeholder="Password" onChange={(e) => setSettings({...settings, data_source_connection_args: {...settings.data_source_connection_args, password: e.target.value}})} />
        <input type="text" placeholder="Host" onChange={(e) => setSettings({...settings, data_source_connection_args: {...settings.data_source_connection_args, host: e.target.value}})} />
        <input type="text" placeholder="Port" onChange={(e) => setSettings({...settings, data_source_connection_args: {...settings.data_source_connection_args, port: e.target.value}})} />
        <input type="text" placeholder="Database" onChange={(e) => setSettings({...settings, data_source_connection_args: {...settings.data_source_connection_args, database: e.target.value}})} />
        <input type="text" placeholder="Schema" onChange={(e) => setSettings({...settings, data_source_connection_args: {...settings.data_source_connection_args, schema: e.target.value}})} />
        <input type="text" placeholder="Description" onChange={(e) => setSettings({...settings, description: e.target.value})} />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Connect Database"}
        </button>
      </form>
      <form onSubmit={handleMindNameSubmit}>
        <input type="text" placeholder="Mind Name" onChange={(e) => setMindName(e.target.value)} />
        <button type="submit" disabled={!mindName}>
          Submit Mind Name
        </button>
      </form>
      {responseMessage && <div className={formStyles.responseMessage}>{responseMessage}</div>}
    </div>
  );
};

export default ConnectDatabase;
