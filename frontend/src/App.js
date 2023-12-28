import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import FileUploader from './components/FileUploader/FileUploader';
import ProgressIndicator from './components/ProgressIndicator/ProgressIndicator';
import StatusMessage from './components/StatusMessage/StatusMessage';
import { uploadCsvFile, processCsvFile, removeCsvRecord } from './services/api';
import './App.css';
import ProcessedTable from './components/ProcessedTable/ProcessedTable';

const SERVER_BASE_URL = 'http://localhost:3001';
const socket = io(SERVER_BASE_URL);

const App = () => {
  const [progress, setProgress] = useState({});
  const [message, setMessage] = useState('');
  let abortController = new AbortController();

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        console.error('No file selected.');
        return;
      }

      setProgress({});
      setMessage('');

      abortController.abort();
      const newController = new AbortController();
      abortController = newController;

      await uploadCsvFile(file, abortController.signal);
    } catch (error) {
      console.error('Error handling file change:', error.message);
      setMessage(error.message);
    } finally {
      event.target.value = null;
    }
  };

  useEffect(() => {
    socket.on('message', (data) => {
      setMessage(data);
      setTimeout(() => {
        setMessage('');
      }, 1000);
    });

    socket.on('progress', (data) => {
      const calculatedProgress =
        ((data.validated || data.processed) / data.totalRecords) * 100;
      data.calculatedProgress = calculatedProgress;
      setProgress(data);
    });

    socket.on('askForConsent', (data) => {
      const { uuid, failedRecords, successRecords } = data;
      if (!uuid) return;

      if (!successRecords) {
        setMessage('No valid Records to Process');
        setProgress({});
        return;
      }

      if (!failedRecords) {
        processCsvFile(uuid);
        return;
      }

      if (window.confirm(`Validated Completed with ${failedRecords} Records`)) {
        processCsvFile(uuid);
      } else {
        setProgress({});
        setMessage('Operation cancelled By User');
        removeCsvRecord(uuid);
      }
    });

    return () => {
      socket.off('message');
      socket.off('askForConsent');
      socket.off('progress');
      abortController.abort();
    };
  }, []);

  return (
    <div class='main'>
      <h1>CSV Import App</h1>
      <FileUploader onChange={handleFileChange} />
      <br />
      {!!progress.calculatedProgress && (
        <ProgressIndicator
          value={progress.calculatedProgress}
          message={progress.message}
          type={progress.type}
        />
      )}
      <StatusMessage message={message} />
      <ProcessedTable
        activated={progress.activated}
        alreadyActive={progress.alreadyActive}
      />
    </div>
  );
};

export default App;
