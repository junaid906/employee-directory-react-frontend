import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getPosition, updatePosition } from "../api/employees";
import type { UpdatePositionDto } from "../types/employee";
import PageCard from "../components/PageCard";
import PositionForm from "../components/PositionForm";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { useAsyncData } from "../hooks/useAsyncData";
import { useReferenceData } from "../hooks/useReferenceData";
import { getProblemDetailsMessage } from "../lib/apiError";
import {
  POSITIONS_LOAD_ERROR,
  POSITION_LOAD_ERROR,
  UPDATE_POSITION_ERROR,
} from "../lib/messages";
import {
  buildChildrenMapFromPositions,
  getAllDescendantIds,
} from "../lib/orgChart";

export default function EditPositionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const positionId = id ?? "";

  const {
    data: position,
    loading: isLoadingPosition,
    error: positionError,
    reload: reloadPosition,
  } = useAsyncData(
    `position:${positionId}`,
    () => getPosition(positionId),
    POSITION_LOAD_ERROR,
  );

  const {
    data: referenceData,
    loading: isLoadingReference,
    error: referenceError,
    reload: reloadReference,
  } = useReferenceData();

  const loading = isLoadingPosition || isLoadingReference;
  const loadError = positionError ?? referenceError;

  function reload() {
    reloadPosition();
    reloadReference();
  }

  const excludedParentIds = useMemo(() => {
    if (!referenceData) return new Set<string>();
    const childrenMap = buildChildrenMapFromPositions(referenceData.positions);
    return new Set<string>([
      positionId,
      ...getAllDescendantIds(positionId, childrenMap),
    ]);
  }, [referenceData, positionId]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(payload: UpdatePositionDto) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await updatePosition(positionId, payload);
      navigate("/org-chart");
    } catch (error) {
      setSubmitError(getProblemDetailsMessage(error, UPDATE_POSITION_ERROR));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageCard title="Edit position" subtitle="Update position details">
      <div className="p-6">
        {loading ? (
          <LoadingState message="Loading position…" />
        ) : loadError || !position || !referenceData ? (
          <ErrorState
            message={loadError ?? POSITIONS_LOAD_ERROR}
            onRetry={reload}
          />
        ) : (
          <PositionForm
            key={positionId}
            initial={{
              jobTitle: position.jobTitle,
              departmentUniqueId: position.departmentUniqueId,
              subDepartmentUniqueId: position.subDepartmentUniqueId ?? "",
              seatingPosition: String(position.seatingPosition),
              reportToPositionUniqueId: position.reportToPositionUniqueId ?? "",
              childPositionUniqueIds: [],
            }}
            positions={referenceData.positions}
            departments={referenceData.departments}
            subDepartments={referenceData.subDepartments}
            excludedParentIds={excludedParentIds}
            submitting={submitting}
            error={submitError}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/org-chart")}
          />
        )}
      </div>
    </PageCard>
  );
}
