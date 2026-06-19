import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFiles = (jdFile, resumeFiles) => {
  const form = new FormData();
  form.append('jd_file', jdFile);
  
  if (Array.isArray(resumeFiles)) {
    resumeFiles.forEach((file) => form.append('resume_files', file));
  } else {
    form.append('resume_files', resumeFiles);
  }
  
  return api.post('/api/upload', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const runScreening = (sessionId) => {
  return api.post(`/api/screen/${sessionId}`);
};

export const getResults = (sessionId) => {
  return api.get(`/api/results/${sessionId}`);
};

export default api;
