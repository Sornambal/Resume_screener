import React, { useState } from 'react';
import QABadge from './QABadge';
import AuditDrawer from './AuditDrawer';

export default function CandidateCard({ candidate }) {
  const [auditOpen, setAuditOpen] = useState(false);
  const finalScore = Math.round(candidate.final_score);

  const getCircleColor = () => {
    if (candidate.final_score >= 80) return '#64FFDA';
    if (candidate.final_score >= 60) return '#FFA500';
    return '#FF6B6B';
  };

  const renderCircleProgress = () => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (candidate.final_score / 100) * circumference;

    return (
      <svg width="120" height="120" className="transform -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#30363D"
          strokeWidth="4"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={getCircleColor()}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <text
          x="60"
          y="70"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#64FFDA"
          fontFamily="JetBrains Mono"
        >
          {Math.round(candidate.final_score)}
        </text>
      </svg>
    );
  };

  const semanticPercent = Math.round(candidate.semantic_score * 100);

  return (
    <>
      <div className="bg-card-bg border border-border rounded-lg p-6 mb-6 hover:border-accent/50 transition-colors">
        {/* Header with rank */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="bg-accent text-dark-bg font-mono font-bold rounded-full w-10 h-10 flex items-center justify-center">
              #{candidate.rank}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-mono text-text-primary">{candidate.resume_filename}</h3>
              <div className="mt-2 flex items-center gap-3">
                <div className="rounded-full px-3 py-1 bg-accent/10 text-accent font-bold text-sm tracking-wide">
                  Final Score
                </div>
                <div className="text-3xl font-bold text-white">{finalScore}</div>
              </div>
              <p className="text-xs text-text-muted mt-1">Final Score</p>
            </div>
          </div>
          <QABadge flagLevel={candidate.qa_report.flag_level} report={candidate.qa_report} />
        </div>

        {/* Main score display */}
        <div className="flex items-center gap-8 mb-6">
          <div>{renderCircleProgress()}</div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-2">Final Score</p>
            <p className="text-5xl font-bold text-white">{finalScore}</p>
          </div>
          <div className="flex-1 space-y-4">
            {/* Semantic match bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-text-secondary font-mono">Semantic Match</span>
                <span className="text-xs text-accent font-mono">{semanticPercent}%</span>
              </div>
              <div className="w-full h-2 bg-card-bg border border-border rounded overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${semanticPercent}%` }}
                />
              </div>
            </div>

            {/* LLM Scores bar */}
            <div>
              <div className="text-xs text-text-secondary font-mono mb-2">LLM Scores (3 runs)</div>
              <div className="flex gap-2">
                {candidate.llm_runs.map((run) => (
                  <div
                    key={run.run_index}
                    className="flex-1 bg-card-bg border border-border rounded px-2 py-1"
                  >
                    <div className="text-xs text-accent font-mono">{run.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Expandable runs */}
        <details className="mb-4 group">
          <summary className="cursor-pointer text-sm text-accent hover:text-accent/80 transition-colors font-mono">
            ▶ View All 3 Runs
          </summary>
          <div className="mt-4 space-y-4 ml-4 border-l border-border pl-4">
            {candidate.llm_runs.map((run) => (
              <div key={run.run_index} className="bg-dark-bg/50 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-accent font-mono">Run {run.run_index + 1}</span>
                  <span className="text-sm text-accent font-mono">{run.score}/100</span>
                </div>
                <p className="text-xs text-text-secondary mb-2">{run.justification}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-text-muted font-mono mb-1">Strengths:</p>
                    <ul className="text-text-secondary">
                      {run.strengths.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-text-muted font-mono mb-1">Gaps:</p>
                    <ul className="text-text-secondary">
                      {run.gaps.map((g, i) => (
                        <li key={i}>• {g}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </details>

        {/* Audit button */}
        <button
          onClick={() => setAuditOpen(true)}
          className="w-full px-4 py-2 bg-dark-bg border border-border hover:border-accent text-accent font-mono text-sm rounded transition-colors"
        >
          📊 View Audit Log
        </button>
      </div>

      <AuditDrawer candidate={candidate} open={auditOpen} onClose={() => setAuditOpen(false)} />
    </>
  );
}
