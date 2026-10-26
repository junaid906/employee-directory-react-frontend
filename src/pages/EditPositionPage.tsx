import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getPosition,
  reparentPositions,
  updatePosition,
} from "../api/employees";
import type { UpdatePositionDto } from "../types/employee";
import PositionForm from "../components/PositionForm";
import ReparentForm from "../components/position/ReparentForm";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { useAsyncData } from "../hooks/useAsyncData";
import { useReferenceData } from "../hooks/useReferenceData";
import { getProblemDetailsMessage } from "../lib/apiError";
import {
  POSITIONS_LOAD_ERROR,
  POSITION_LOAD_ERROR,
  REPARENT_POSITION_ERROR,
  UPDATE_POSITION_ERROR,
} from "../lib/messages";

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

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);

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

  async function handleReparent(
    targetParentUniqueId: string,
    childPositionUniqueIds: string[],
  ) {
    setIsMoving(true);
    setMoveError(null);
    try {
      await reparentPositions({
        reportToPositionUniqueId: targetParentUniqueId,
        childPositionUniqueIds,
      });
      navigate("/org-chart");
    } catch (error) {
      setMoveError(getProblemDetailsMessage(error, REPARENT_POSITION_ERROR));
    } finally {
      setIsMoving(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading position…" />;
  }

  if (loadError || !position || !referenceData) {
    return (
      <ErrorState message={loadError ?? POSITIONS_LOAD_ERROR} onRetry={reload} />
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="rounded border border-neutral-300 bg-white p-6">
        <h1 className="mb-6 text-xl font-semibold text-black">Edit position</h1>
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
          departments={referenceData.departments}
          subDepartments={referenceData.subDepartments}
          submitting={submitting}
          error={submitError}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/org-chart")}
        />
      </div>

      <div className="rounded border border-neutral-300 bg-white p-6">
        <h1 className="mb-6 text-xl font-semibold text-black">Move position</h1>
        <ReparentForm
          key={`move-${positionId}`}
          positions={referenceData.positions}
          initialMoverIds={[positionId]}
          submitting={isMoving}
          error={moveError}
          onSubmit={handleReparent}
        />
      </div>
    </div>
  );
}
