import axios from 'axios';

export const SERVER_BASE_URL = 'http://localhost:3001';
const SERVER_API_URL = `${SERVER_BASE_URL}/api/csv`;

const createFormData = (file) => {
  const formData = new FormData();
  formData.append('csvFile', file);
  return formData;
};

const uploadCsvFile = async (file, signal) => {
  try {
    const formData = createFormData(file);
    await axios.post(`${SERVER_API_URL}/validate-csv`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal,
    });
  } catch (error) {
    console.error(error);
  }
};

const processCsvFile = async (processApiId) => {
  try {
    await axios.get(`${SERVER_API_URL}/process-csv/${processApiId}`);
  } catch (error) {
    console.error(error);
  }
};

const removeCsvRecord = async (processApiId) => {
  try {
    await axios.get(`${SERVER_API_URL}/remove-csv/${processApiId}`);
  } catch (error) {
    console.error(error);
  }
};

export { uploadCsvFile, processCsvFile, removeCsvRecord };
