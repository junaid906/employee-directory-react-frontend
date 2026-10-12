import { useState } from "react";

export function useWizard(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(1);

  return {
    currentStep,
    totalSteps,
    isFirst: currentStep === 1,
    isLast: currentStep === totalSteps,
    next: () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps)),
    previous: () => setCurrentStep((prev) => Math.max(prev - 1, 1)),
  };
}
