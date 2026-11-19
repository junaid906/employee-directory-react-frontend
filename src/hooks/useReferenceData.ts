import { getDepartments, getSubDepartments } from "../api/departments";
import { getPositions } from "../api/positions";
import { POSITIONS_LOAD_ERROR } from "../lib/messages";
import { useAsyncData } from "./useAsyncData";

export function useReferenceData() {
  return useAsyncData(
    "reference-data",
    () =>
      Promise.all([getPositions(), getDepartments(), getSubDepartments()]).then(
        ([positions, departments, subDepartments]) => ({
          positions,
          departments,
          subDepartments,
        }),
      ),
    POSITIONS_LOAD_ERROR,
  );
}
