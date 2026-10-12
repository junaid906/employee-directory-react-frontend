import { Link } from "react-router";
import Button from "./ui/Button";
import { buttonClasses } from "./ui/buttonClasses";

interface WizardFooterProps {
  cancelTo: string;
  isFirst: boolean;
  isLast: boolean;
  canProceed: boolean;
  submitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function WizardFooter({
  cancelTo,
  isFirst,
  isLast,
  canProceed,
  submitting = false,
  submitLabel,
  submittingLabel,
  onPrevious,
  onNext,
  onSubmit,
}: WizardFooterProps) {
  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <Link to={cancelTo} className={buttonClasses("secondary")}>
        Cancel
      </Link>

      <div className="flex gap-2">
        {!isFirst && (
          <Button variant="secondary" onClick={onPrevious}>
            Back
          </Button>
        )}
        {!isLast ? (
          <Button onClick={onNext} disabled={!canProceed}>
            Next
          </Button>
        ) : (
          <Button onClick={onSubmit} disabled={submitting || !canProceed}>
            {submitting ? submittingLabel : submitLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
