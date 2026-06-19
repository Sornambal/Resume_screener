import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import CandidateCard from './components/CandidateCard';
import LoadingScreen from './components/LoadingScreen';
import './index.css';

export default function App() {
  const [view, setView] = useState('upload'); // 'upload', 'loading', 'results'
  const [results, setResults] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const handleResults = (data) => {
    setResults(data);
    setSessionId(data.session_id);
    setView('results');
  };

  const handleLoading = (isLoading) => {
    setView(isLoading ? 'loading' : 'upload');
  };

  const handleReset = () => {
    setView('upload');
    setResults(null);
    setSessionId(null);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {view === 'upload' && (
        <FileUpload onResults={handleResults} onLoading={handleLoading} />
      )}

      {view === 'loading' && <LoadingScreen />}

      {view === 'results' && results && (
        <div className="min-h-screen bg-dark-bg p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-mono font-bold text-accent">Screening Results</h1>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-border hover:bg-border/80 text-accent font-mono text-sm rounded transition-colors"
              >
                ← New Screening
              </button>
            </div>

            <div className="mb-4 text-xs text-text-muted font-mono">
              Session: {sessionId}
            </div>

            <div className="space-y-4">
              {results.candidates && results.candidates.length > 0 ? (
                results.candidates.map((candidate) => (
                  <CandidateCard key={candidate.rank} candidate={candidate} />
                ))
              ) : (
                <p className="text-center text-text-secondary">No candidates to display</p>
              )}
            </div>

            <div className="mt-12 text-center text-xs text-text-muted">
              <p>Audit logs saved to: {results.audit_log_path}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
