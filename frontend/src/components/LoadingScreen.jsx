import React, { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Extracting text from files...',
    'Generating embeddings...',
    'Running FAISS semantic search...',
    'LLM scoring (run 1/3)...',
    'LLM scoring (run 2/3)...',
    'LLM scoring (run 3/3)...',
    'Running QA consistency checks...',
    'Finalizing results...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-mono font-bold text-accent mb-12">
          Resume Screening QA
        </h1>

        <div className="mb-12">
          <div className="flex justify-center gap-3 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  i === currentStep % 4 ? 'w-8 bg-accent' : 'bg-accent/30'
                }`}
              />
            ))}
          </div>
          <p className="text-lg text-accent font-mono mb-2">{steps[currentStep]}</p>
          <p className="text-sm text-text-secondary">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step list */}
        <div className="mt-12 text-left max-w-md mx-auto space-y-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`text-sm transition-colors ${
                idx < currentStep
                  ? 'text-green-400 line-through'
                  : idx === currentStep
                  ? 'text-accent'
                  : 'text-text-secondary'
              }`}
            >
              <span className="font-mono mr-2">
                {idx < currentStep ? '✓' : idx === currentStep ? '●' : '○'}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
