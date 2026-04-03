import { useEffect } from "react";
import { Typography } from "antd";
import { useGatcPrograms } from "../../hooks/gatc/useGatc";
import { ProgramList } from "../../components/gatc/speakers/ProgramList";

const { Title, Paragraph } = Typography;

function GatcPrograms() {
  const {
    mutate: fetchPrograms,
    data: programsData,
    isPending,
  } = useGatcPrograms();

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 animate-fade-in text-center">
          <Title level={2} className="mb-2! tracking-tight text-gray-900">
            Event Schedule & Speakers
          </Title>
          <Paragraph className="text-base text-gray-600 sm:text-lg">
            Explore the full agenda, discover topics, and meet the amazing
            speakers for our upcoming sessions.
          </Paragraph>
        </div>

        <ProgramList programs={programsData || []} isLoading={isPending} />
      </div>
    </div>
  );
}

export default GatcPrograms;
