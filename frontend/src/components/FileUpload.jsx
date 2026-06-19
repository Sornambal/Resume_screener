import React, { useState } from 'react';
import { uploadFiles, runScreening } from '../api/client';
import '../index.css';

export default function FileUpload({ onResults, onLoading }) {
  const [jdFile, setJdFile] = useState(null);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [dragOverJd, setDragOverJd] = useState(false);
  const [dragOverResumes, setDragOverResumes] = useState(false);
  const [error, setError] = useState(null);

  const handleDragOver = (e, setDragOver) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e, setDragOver) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFilesSelected = (files, isJd) => {
    const validFiles = Array.from(files).filter((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ['.pdf', '.md', '.txt'].includes('.' + ext);
    });

    if (validFiles.length !== files.length) {
      setError('Some files were skipped - only .pdf, .md, .txt allowed');
    }

    if (isJd) {
      if (validFiles.length > 0) {
        setJdFile(validFiles[0]);
        setError(null);
      }
    } else {
      setResumeFiles([...resumeFiles, ...validFiles]);
      setError(null);
    }
  };

  const handleJdDrop = (e) => {
    e.preventDefault();
    setDragOverJd(false);
    handleFilesSelected(e.dataTransfer.files, true);
  };

  const handleResumesDrop = (e) => {
    e.preventDefault();
    setDragOverResumes(false);
    handleFilesSelected(e.dataTransfer.files, false);
  };

  const removeJd = () => {
    setJdFile(null);
  };

  const removeResume = (index) => {
    setResumeFiles(resumeFiles.filter((_, i) => i !== index));
  };

  const handleStartScreening = async () => {
    if (!jdFile || resumeFiles.length === 0) {
      setError('Please upload JD and at least one resume');
      return;
    }

    try {
      setError(null);
      onLoading(true);

      // Upload files
      const uploadResponse = await uploadFiles(jdFile, resumeFiles);
      const sessionId = uploadResponse.data.session_id;

      // Run screening
      const screeningResponse = await runScreening(sessionId);
      onResults(screeningResponse.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error during screening. Please try again.');
      onLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-mono font-bold text-accent mb-12 text-center">
          Resume Screening QA
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* JD Upload */}
          <div>
            <h2 className="text-xl font-mono text-accent mb-4">Job Description</h2>
            <div
              onDragOver={(e) => handleDragOver(e, setDragOverJd)}
              onDragLeave={(e) => handleDragLeave(e, setDragOverJd)}
              onDrop={handleJdDrop}
              className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
                dragOverJd
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-card-bg'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.md,.txt"
                onChange={(e) => handleFilesSelected(e.target.files, true)}
                className="hidden"
                id="jd-input"
              />
              <label
                htmlFor="jd-input"
                className="cursor-pointer block text-center text-text-secondary hover:text-accent transition-colors"
              >
                <p className="text-sm mb-2">📄 Drag & drop or click to select</p>
                <p className="text-xs text-text-muted">Supported: .pdf, .md, .txt</p>
              </label>
            </div>
            {jdFile && (
              <div className="mt-4 flex items-center justify-between bg-card-bg p-3 rounded border border-border">
                <span className="text-sm truncate text-text-primary">{jdFile.name}</span>
                <button
                  onClick={removeJd}
                  className="text-accent hover:text-red-400 transition-colors ml-2"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Resumes Upload */}
          <div>
            <h2 className="text-xl font-mono text-accent mb-4">Resumes</h2>
            <div
              onDragOver={(e) => handleDragOver(e, setDragOverResumes)}
              onDragLeave={(e) => handleDragLeave(e, setDragOverResumes)}
              onDrop={handleResumesDrop}
              className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
                dragOverResumes
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-card-bg'
              }`}
            >
              <input
                type="file"
                multiple
                accept=".pdf,.md,.txt"
                onChange={(e) => handleFilesSelected(e.target.files, false)}
                className="hidden"
                id="resumes-input"
              />
              <label
                htmlFor="resumes-input"
                className="cursor-pointer block text-center text-text-secondary hover:text-accent transition-colors"
              >
                <p className="text-sm mb-2">📋 Drag & drop or click to select</p>
                <p className="text-xs text-text-muted">Multiple files allowed</p>
              </label>
            </div>
            {resumeFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {resumeFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-card-bg p-3 rounded border border-border"
                  >
                    <span className="text-sm truncate text-text-primary">{file.name}</span>
                    <button
                      onClick={() => removeResume(idx)}
                      className="text-accent hover:text-red-400 transition-colors ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded mb-8">
            {error}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStartScreening}
            disabled={!jdFile || resumeFiles.length === 0}
            className="px-8 py-3 bg-accent text-dark-bg font-mono font-bold rounded hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Screening
          </button>
        </div>
      </div>
    </div>
  );
}
