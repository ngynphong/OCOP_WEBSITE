'use client';

import React from 'react';
import { StepItem } from './types';

interface WizardProgressBarProps {
  currentStep: number;
  steps: StepItem[];
}

export default function WizardProgressBar({ currentStep, steps }: WizardProgressBarProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full overflow-hidden z-0">
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.id;
          const isCompleted = currentStep > s.id;

          return (
            <div
              key={s.id}
              className="relative z-10 flex flex-col items-center gap-2 bg-white px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-md shadow-blue-100'
                    : isCompleted
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-xs font-semibold ${
                  isActive || isCompleted ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
