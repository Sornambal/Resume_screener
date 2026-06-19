import React from 'react';

export default function AuditDrawer({ candidate, open, onClose }) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-card-bg border-l border-border shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-mono text-accent">Audit Log</h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-accent transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-text-secondary mb-6">
            {candidate.resume_filename}
          </p>

          {/* QA Report Summary */}
          <div className="bg-dark-bg/50 rounded p-4 mb-6 border border-border">
            <h3 className="text-sm font-mono text-accent mb-3">QA Summary</h3>
            <div className="space-y-2 text-xs text-text-secondary">
              <p>
                <span className="text-accent">Consistency:</span>{' '}
                {candidate.qa_report.is_consistent ? '✓ Consistent' : '✗ Inconsistent'}
              </p>
              <p>
                <span className="text-accent">Score Variance:</span>{' '}
                <span
                  className={candidate.qa_report.score_variance > 10 ? 'text-red-400' : 'text-green-400'}
                >
                  {candidate.qa_report.score_variance.toFixed(1)} points
                </span>
              </p>
              <p>
                <span className="text-accent">Range:</span> {candidate.qa_report.min_score} -{' '}
                {candidate.qa_report.max_score}
              </p>
              <p>
                <span className="text-accent">Mean Score:</span> {candidate.qa_report.mean_score.toFixed(1)}
              </p>
              {candidate.qa_report.contradiction_detected && (
                <p className="text-red-400 mt-2">
                  ⚠ {candidate.qa_report.contradiction_detail}
                </p>
              )}
            </div>
          </div>

          {/* Runs Detail */}
          <div>
            <h3 className="text-sm font-mono text-accent mb-3">Detailed Runs</h3>
            <div className="space-y-4">
              {candidate.llm_runs.map((run) => (
                <div key={run.run_index} className="bg-dark-bg/50 rounded p-4 border border-border">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-accent">Run {run.run_index + 1}</span>
                    <span className="text-lg font-mono text-accent font-bold">{run.score}/100</span>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-text-muted mb-1 font-mono">Justification</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{run.justification}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-text-muted mb-1 font-mono">Strengths</p>
                      <ul className="text-xs text-text-secondary space-y-1">
                        {run.strengths.map((s, i) => (
                          <li key={i} className="flex gap-1">
                            <span className="text-accent">›</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1 font-mono">Gaps</p>
                      <ul className="text-xs text-text-secondary space-y-1">
                        {run.gaps.map((g, i) => (
                          <li key={i} className="flex gap-1">
                            <span className="text-accent">›</span>
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score variance visualization */}
          <div className="mt-6 bg-dark-bg/50 rounded p-4 border border-border">
            <h3 className="text-sm font-mono text-accent mb-3">Score Distribution</h3>
            <div className="flex items-end gap-2 h-20">
              {candidate.llm_runs.map((run) => (
                <div key={run.run_index} className="flex-1">
                  <div
                    className="w-full bg-accent/50 rounded-t transition-all hover:bg-accent"
                    style={{ height: `${(run.score / 100) * 80}px` }}
                  />
                  <p className="text-xs text-center text-text-muted mt-2">{run.score}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
