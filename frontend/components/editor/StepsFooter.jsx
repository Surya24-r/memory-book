"use client";

import { useEditorStore } from '@/components/store/useEditorStore';

const STEPS = [
  { id: 1, label: 'Upload' },
  { id: 2, label: 'Layout' },
  { id: 3, label: 'Review' },
];

export default function StepsFooter() {
  const currentStep = useEditorStore((s) => s.currentStep);
  const saveDraft = useEditorStore((s) => s.saveDraft);

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white border-t border-neutral-200">
      <div className="flex items-center gap-3">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step.id === currentStep
                    ? 'bg-amber-500 text-white'
                    : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {step.id}
              </span>
              <span
                className={`text-sm ${
                  step.id === currentStep
                    ? 'font-semibold text-neutral-900'
                    : 'text-neutral-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <span className="w-8 h-px bg-neutral-200" />}
          </div>
        ))}
      </div>

      <button onClick={saveDraft} className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800">
        Next →
      </button>
    </div>
  );
}