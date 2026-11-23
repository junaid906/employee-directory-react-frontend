interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export default function StepProgress({
  currentStep,
  totalSteps,
  title,
}: StepProgressProps) {
  return (
    <div className="mb-6">
      <h1 className="text-lg font-semibold sm:text-xl text-black">{title}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="mt-2 h-2 w-full rounded-full bg-neutral-200">
        <div
          className="h-2 rounded-full bg-black transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
