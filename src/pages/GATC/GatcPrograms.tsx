import { useEffect } from "react";
import { ProgramList } from "../../components/gatc/speakers/ProgramList";
import { useGatcPrograms } from "../../hooks/gatc/useGatc";

function GatcPrograms() {
  const {
    mutate: fetchPrograms,
    data: programsData,
    isPending,
  } = useGatcPrograms();

  useEffect(() => {
    fetchPrograms(undefined);
  }, [fetchPrograms]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ProgramList programs={programsData || []} isLoading={isPending} />
    </div>
  );
}

export default GatcPrograms;
