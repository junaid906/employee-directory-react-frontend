import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import Step1 from "../components/CreateEmployeeForm/Step1";
import Step2 from "../components/CreateEmployeeForm/Step2";
import Step3 from "../components/CreateEmployeeForm/Step3";
import StepProgress from "../components/CreateEmployeeForm/StepProgress";
import {
  createEmployee,
  getPositions,
  type CreateEmployeeDto,
} from "../api/employees";
import { useAsyncData } from "../hooks/useAsyncData";
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
  const [currentStep, setCurrentStep] = useState(1);
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
    } catch {
      setSubmitError(CREATE_EMPLOYEE_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }

  function goToNextStep() {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  }

  function goToPreviousStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded border border-neutral-300 bg-white p-6">
        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {submitError && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
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

        <div className="mt-6 flex items-center justify-between gap-4">
          <Link
            to="/employees"
            className="rounded border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-50"
          >
            Cancel
          </Link>

          <div className="flex gap-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="rounded border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-50"
              >
                Back
              </button>
            )}
            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!validateStep(currentStep)}
                className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Employee"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
