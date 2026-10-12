import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Step1 from "../components/CreateEmployeeForm/Step1";
import Step2 from "../components/CreateEmployeeForm/Step2";
import Step3 from "../components/CreateEmployeeForm/Step3";
import StepProgress from "../components/StepProgress";
import WizardFooter from "../components/WizardFooter";
import ErrorBanner from "../components/ui/ErrorBanner";
import {
  createEmployee,
  getPositions,
  type CreateEmployeeDto,
} from "../api/employees";
import { useAsyncData } from "../hooks/useAsyncData";
import { useWizard } from "../hooks/useWizard";
import { getProblemDetailsMessage } from "../lib/apiError";
import { COMPANY_EMAIL_DOMAIN } from "../lib/constants";
import { CREATE_EMPLOYEE_ERROR, POSITIONS_LOAD_ERROR } from "../lib/messages";

const TOTAL_STEPS = 3;

const initialFormData: CreateEmployeeDto = {
  firstName: "",
  lastName: "",
  email: "",
  positionUniqueId: "",
  avatarUrl: null,
  role: 1,
};

export default function CreateEmployeePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentStep, isFirst, isLast, next, previous } =
    useWizard(TOTAL_STEPS);
  const [formData, setFormData] = useState<CreateEmployeeDto>(() => ({
    ...initialFormData,
    positionUniqueId: searchParams.get("position") ?? "",
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    data: positions,
    loading: isLoadingPositions,
    error: positionsError,
  } = useAsyncData("positions", getPositions, POSITIONS_LOAD_ERROR);

  const positionOptions = positions ?? [];

  function handleFieldChange(field: keyof CreateEmployeeDto, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handlePositionChange(positionId: string) {
    setFormData((prev) => ({ ...prev, positionUniqueId: positionId }));
  }

  function validateStep(step: number): boolean {
    switch (step) {
      case 1:
        return (
          formData.firstName.trim() !== "" &&
          formData.lastName.trim() !== "" &&
          formData.email.trim() !== "" &&
          formData.email.endsWith(`@${COMPANY_EMAIL_DOMAIN}`)
        );
      case 2:
        return formData.positionUniqueId !== "";
      case 3:
        return true;
      default:
        return false;
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const employee = await createEmployee(formData);
      navigate(`/employees/${employee.uniqueId}`);
    } catch (error) {
      setSubmitError(getProblemDetailsMessage(error, CREATE_EMPLOYEE_ERROR));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded border border-neutral-300 bg-white p-6">
        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {submitError && (
          <ErrorBanner className="mb-4">{submitError}</ErrorBanner>
        )}

        <div className="min-h-[280px]">
          {currentStep === 1 && (
            <Step1 formData={formData} onChange={handleFieldChange} />
          )}
          {currentStep === 2 && (
            <Step2
              formData={formData}
              positions={positionOptions}
              isLoadingPositions={isLoadingPositions}
              error={positionsError}
              onPositionChange={handlePositionChange}
            />
          )}
          {currentStep === 3 && (
            <Step3 formData={formData} onChange={handleFieldChange} />
          )}
        </div>

        <WizardFooter
          cancelTo="/employees"
          isFirst={isFirst}
          isLast={isLast}
          canProceed={validateStep(currentStep)}
          submitting={isSubmitting}
          submitLabel="Create Employee"
          submittingLabel="Creating..."
          onPrevious={previous}
          onNext={next}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
