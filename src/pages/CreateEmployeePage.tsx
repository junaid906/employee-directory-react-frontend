import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Step1 from "../components/CreateEmployeeForm/Step1";
import Step2 from "../components/CreateEmployeeForm/Step2";
import Step3 from "../components/CreateEmployeeForm/Step3";
import { createEmployee, getPositions, type CreateEmployeeDto, type Position } from "../api/employees";

const TOTAL_STEPS = 3;

const initialFormData: CreateEmployeeDto = {
  firstName: "",
  lastName: "",
  email: "",
  positionUniqueId: null,
  avatarUrl: null,
};

export default function CreateEmployeePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateEmployeeDto>(initialFormData);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const loadPositions = async () => {
      setIsLoadingPositions(true);
      try {
        const positionList = await getPositions();
        setPositions(positionList);
      } catch {
        console.error("Failed to load positions");
      } finally {
        setIsLoadingPositions(false);
      }
    };
    loadPositions();
  }, []);

  function handleFieldChange(field: keyof CreateEmployeeDto, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handlePositionChange(positionId: string | null) {
    setFormData((prev) => ({ ...prev, positionUniqueId: positionId }));
  }

  function validateStep(step: number): boolean {
    switch (step) {
      case 1:
        return (
          formData.firstName.trim() !== "" &&
          formData.lastName.trim() !== "" &&
          formData.email.trim() !== "" &&
          formData.email.endsWith("@wbwr.io")
        );
      case 2:
        return true;
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
      setSubmitError("Failed to create employee. Please try again.");
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
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-black">Create Employee</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-neutral-200">
            <div
              className="h-2 rounded-full bg-black transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

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
              positions={positions}
              isLoadingPositions={isLoadingPositions}
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
