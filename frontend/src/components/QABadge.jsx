import React from 'react';

export default function QABadge({ flagLevel, report }) {
  const getStyles = () => {
    switch (flagLevel) {
      case 'PASS':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'WARN':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'FAIL':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getIcon = () => {
    switch (flagLevel) {
      case 'PASS':
        return '✓';
      case 'WARN':
        return '⚠';
      case 'FAIL':
        return '✗';
      default:
        return '○';
    }
  };

  const getLabel = () => {
    switch (flagLevel) {
      case 'PASS':
        return 'Consistent';
      case 'WARN':
        return 'Review needed';
      case 'FAIL':
        return 'Inconsistent';
      default:
        return 'Unknown';
    }
  };

  const tooltipContent = `
    Score Range: ${report.min_score} - ${report.max_score}
    Variance: ${report.score_variance.toFixed(1)} points
    ${report.contradiction_detected ? `⚠ Contradiction: ${report.contradiction_detail || 'Detected'}` : ''}
  `.trim();

  return (
    <div className="group relative">
      <div
        className={`inline-block px-3 py-1 rounded-full text-sm font-mono border ${getStyles()}`}
      >
        {getIcon()} {getLabel()}
      </div>
      <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dark-bg border border-border rounded text-xs text-text-secondary whitespace-nowrap z-10">
        {tooltipContent}
      </div>
    </div>
  );
}
