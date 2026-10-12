import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { insertPosition } from "../api/employees";
import ChildPositionPicker from "../components/position/ChildPositionPicker";
import DepartmentFields from "../components/position/DepartmentFields";
import ParentSelect from "../components/position/ParentSelect";
import SeatingField from "../components/position/SeatingField";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import StepProgress from "../components/StepProgress";
import WizardFooter from "../components/WizardFooter";
import ErrorBanner from "../components/ui/ErrorBanner";
import { usePositionFormState } from "../hooks/usePositionFormState";
import { useReferenceData } from "../hooks/useReferenceData";
import { useWizard } from "../hooks/useWizard";
import { getProblemDetailsMessage } from "../lib/apiError";
import {
  CREATE_POSITION_ERROR,
  POSITIONS_LOAD_ERROR,
} from "../lib/messages";

const TOTAL_STEPS = 3;

export default function CreatePositionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    data: referenceData,
    loading,
    error: loadError,
    reload,
  } = useReferenceData();

  const { currentStep, isFirst, isLast, next, previous } =
    useWizard(TOTAL_STEPS);
  const form = usePositionFormState({
    jobTitle: "",
    departmentUniqueId: "",
    subDepartmentUniqueId: "",
    reportToPositionUniqueId: searchParams.get("parent") ?? "",
    childPositionUniqueIds: [],
    seatingPosition: "0",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await insertPosition(form.toInsertDto());
      navigate("/org-chart");
    } catch (error) {
      setSubmitError(getProblemDetailsMessage(error, CREATE_POSITION_ERROR));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading positions…" />;
  }

  if (loadError || !referenceData) {
    return (
      <ErrorState message={loadError ?? POSITIONS_LOAD_ERROR} onRetry={reload} />
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded border border-neutral-300 bg-white p-6">
        <StepProgress
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          title="Create position"
        />

        {submitError && (
          <ErrorBanner className="mb-4">{submitError}</ErrorBanner>
        )}

        <div className="min-h-[280px]">
          {currentStep === 1 && (
            <DepartmentFields
              jobTitle={form.jobTitle}
              departmentUniqueId={form.departmentUniqueId}
              subDepartmentUniqueId={form.subDepartmentUniqueId}
              departments={referenceData.departments}
              subDepartments={referenceData.subDepartments}
              onJobTitleChange={form.setJobTitle}
              onDepartmentChange={form.handleDepartmentChange}
              onSubDepartmentChange={form.setSubDepartmentUniqueId}
            />
          )}
          {currentStep === 2 && (
            <div className="space-y-4">
              <ParentSelect
                value={form.reportToPositionUniqueId}
                options={referenceData.positions}
                onChange={form.handleParentChange}
                hint="Select a position for this position to report to, or leave it at the top level."
              />
              <ChildPositionPicker
                positions={referenceData.positions}
                parentUniqueId={form.reportToPositionUniqueId}
                selectedIds={form.childPositionUniqueIds}
                onToggle={form.toggleChild}
              />
            </div>
          )}
          {currentStep === 3 && (
            <SeatingField
              value={form.seatingPosition}
              onChange={form.setSeatingPosition}
              hint="Numeric seating order for this position."
            />
          )}
        </div>

        <WizardFooter
          cancelTo="/org-chart"
          isFirst={isFirst}
          isLast={isLast}
          canProceed={form.validateStep(currentStep)}
          submitting={isSubmitting}
          submitLabel="Create position"
          submittingLabel="Creating…"
          onPrevious={previous}
          onNext={next}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
