import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import AvatarStep from "../components/createEmployee/AvatarStep";
import PersonalDetailsStep from "../components/createEmployee/PersonalDetailsStep";
import PositionStep from "../components/createEmployee/PositionStep";
import type {
  EmployeeFormField,
  EmployeeFormState,
} from "../components/createEmployee/formState";
import StepProgress from "../components/StepProgress";
import WizardFooter from "../components/WizardFooter";
import ErrorBanner from "../components/ui/ErrorBanner";
import { createEmployee } from "../api/employees";
import { getPositions } from "../api/positions";
import type { CreateEmployeeDto } from "../types/employee";
import { useAsyncData } from "../hooks/useAsyncData";
import { useSubmit } from "../hooks/useSubmit";
import { useWizard } from "../hooks/useWizard";
import { COMPANY_EMAIL_DOMAIN } from "../lib/constants";
import { CREATE_EMPLOYEE_ERROR, POSITIONS_LOAD_ERROR } from "../lib/messages";

const TOTAL_STEPS = 3;
const DEFAULT_ROLE = 1;

function isCompanyEmail(email: string): boolean {
  return email
    .trim()
    .toLowerCase()
    .endsWith(`@${COMPANY_EMAIL_DOMAIN.toLowerCase()}`);
}

function toCreateEmployeeDto(form: EmployeeFormState): CreateEmployeeDto {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    positionUniqueId: form.positionUniqueId,
    avatarUrl: form.avatarUrl.trim() || null,
    role: DEFAULT_ROLE,
  };
}

export default function CreateEmployeePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentStep, isFirst, isLast, next, previous } =
    useWizard(TOTAL_STEPS);
  const [formData, setFormData] = useState<EmployeeFormState>(() => ({
    firstName: "",
    lastName: "",
    email: "",
    positionUniqueId: searchParams.get("position") ?? "",
    avatarUrl: "",
  }));

  const {
    data: positions,
    loading: isLoadingPositions,
    error: positionsError,
  } = useAsyncData("positions", getPositions, POSITIONS_LOAD_ERROR);

  const { submit, submitting, error: submitError } = useSubmit(async () => {
    const employee = await createEmployee(toCreateEmployeeDto(formData));
    navigate(`/employees/${employee.uniqueId}`);
  }, CREATE_EMPLOYEE_ERROR);

  function handleFieldChange(field: EmployeeFormField, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function validateStep(step: number): boolean {
    switch (step) {
      case 1:
        return (
          formData.firstName.trim() !== "" &&
          formData.lastName.trim() !== "" &&
          isCompanyEmail(formData.email)
        );
      case 2:
        return formData.positionUniqueId !== "";
      case 3:
        return true;
      default:
        return false;
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded border border-neutral-300 bg-white p-6">
        <StepProgress
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          title="Create Employee"
        />

        {submitError && (
          <ErrorBanner className="mb-4">{submitError}</ErrorBanner>
        )}

        <div className="min-h-[280px]">
          {currentStep === 1 && (
            <PersonalDetailsStep formData={formData} onChange={handleFieldChange} />
          )}
          {currentStep === 2 && (
            <PositionStep
              formData={formData}
              positions={positions ?? []}
              isLoadingPositions={isLoadingPositions}
              error={positionsError}
              onPositionChange={(value) =>
                handleFieldChange("positionUniqueId", value)
              }
            />
          )}
          {currentStep === 3 && (
            <AvatarStep formData={formData} onChange={handleFieldChange} />
          )}
        </div>

        <WizardFooter
          cancelTo="/employees"
          isFirst={isFirst}
          isLast={isLast}
          canProceed={validateStep(currentStep)}
          submitting={submitting}
          submitLabel="Create Employee"
          submittingLabel="Creating..."
          onPrevious={previous}
          onNext={next}
          onSubmit={submit}
        />
      </div>
    </div>
  );
}
