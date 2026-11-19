import { useState } from "react";
import { deactivateEmployee } from "../api/employees";
import { DEACTIVATE_EMPLOYEE_ERROR } from "../lib/messages";
import type { Employee } from "../types/employee";
import { useSubmit } from "./useSubmit";

export function useDeactivateEmployee(onDeactivated: () => void) {
  const [target, setTarget] = useState<Employee | null>(null);

  const { submit, submitting, error, clearError } = useSubmit(
    async (employee: Employee) => {
      await deactivateEmployee(employee.uniqueId);
      setTarget(null);
      onDeactivated();
    },
    DEACTIVATE_EMPLOYEE_ERROR,
  );

  function request(employee: Employee) {
    clearError();
    setTarget(employee);
  }

  function cancel() {
    if (submitting) return;
    setTarget(null);
    clearError();
  }

  function confirm() {
    if (target) void submit(target);
  }

  return { target, request, cancel, confirm, submitting, error };
}
