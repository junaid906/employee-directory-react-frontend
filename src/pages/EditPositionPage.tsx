import { useNavigate, useParams } from "react-router";
import {
  getPosition,
  reparentPositions,
  updatePosition,
} from "../api/positions";
import type { UpdatePositionDto } from "../types/position";
import PositionForm from "../components/PositionForm";
import ReparentForm from "../components/position/ReparentForm";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { useAsyncData } from "../hooks/useAsyncData";
import { useReferenceData } from "../hooks/useReferenceData";
import { useSubmit } from "../hooks/useSubmit";
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

  const update = useSubmit(async (payload: UpdatePositionDto) => {
    await updatePosition(positionId, payload);
    navigate("/org-chart");
  }, UPDATE_POSITION_ERROR);

  const move = useSubmit(
    async (targetParentUniqueId: string, childPositionUniqueIds: string[]) => {
      await reparentPositions({
        reportToPositionUniqueId: targetParentUniqueId,
        childPositionUniqueIds,
      });
      navigate("/org-chart");
    },
    REPARENT_POSITION_ERROR,
  );

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
          }}
          departments={referenceData.departments}
          subDepartments={referenceData.subDepartments}
          submitting={update.submitting}
          error={update.error}
          onSubmit={update.submit}
          onCancel={() => navigate("/org-chart")}
        />
      </div>

      <div className="rounded border border-neutral-300 bg-white p-6">
        <h1 className="mb-6 text-xl font-semibold text-black">Move position</h1>
        <ReparentForm
          key={`move-${positionId}`}
          positions={referenceData.positions}
          initialMoverIds={[positionId]}
          submitting={move.submitting}
          error={move.error}
          onSubmit={move.submit}
        />
      </div>
    </div>
  );
}
