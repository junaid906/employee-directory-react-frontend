import { useMemo, useState } from "react";
import type { EmployeeFilters } from "../types/employee";
import { useDebouncedValue } from "./useDebouncedValue";

const MIN_SEARCH_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 300;

export function useEmployeeFilters() {
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [searchInput, setSearchInput] = useState("");

  const trimmedInput = searchInput.trim();
  const debouncedSearch = useDebouncedValue(trimmedInput, SEARCH_DEBOUNCE_MS);
  const search =
    debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch : "";

  const query = useMemo(() => ({ ...filters, search }), [filters, search]);

  const hasFilters =
    Object.values(filters).some((value) => value !== undefined && value !== "") ||
    trimmedInput !== "";

  const isSearchTooShort =
    trimmedInput.length > 0 && trimmedInput.length < MIN_SEARCH_LENGTH;

  function setDepartment(value: string) {
    setFilters((prev) => ({
      ...prev,
      departmentUniqueId: value,
      subDepartmentUniqueId: "",
      positionUniqueId: "",
    }));
  }

  function setSubDepartment(value: string) {
    setFilters((prev) => ({
      ...prev,
      subDepartmentUniqueId: value,
      positionUniqueId: "",
    }));
  }

  function setPosition(value: string) {
    setFilters((prev) => ({ ...prev, positionUniqueId: value }));
  }

  function clear() {
    setFilters({});
    setSearchInput("");
  }

  return {
    filters,
    searchInput,
    setSearchInput,
    isSearchTooShort,
    query,
    hasFilters,
    setDepartment,
    setSubDepartment,
    setPosition,
    clear,
  };
}

export type EmployeeFiltersState = ReturnType<typeof useEmployeeFilters>;
