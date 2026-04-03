import { useParams, useRouter } from "@tanstack/react-router";
import { useGatcSpeakerById, useGatcPrograms } from "../../hooks/gatc/useGatc";
import { Button, Tabs } from "antd";
import {
  ArrowLeftOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import { ProgramList } from "../../components/gatc/speakers/ProgramList";
import { ProgramCard } from "../../components/gatc/speakers/ProgramCard";
import { getAvatarByName } from "../../utils/avatar.utils";

const GatcSpeakerDetails = () => {
  const { speakerId } = useParams({ strict: false });
  const router = useRouter();
  
  const { 
    data: speaker, 
    isLoading: isSpeakerLoading 
  } = useGatcSpeakerById(speakerId as string);
  
  const {
    mutate: fetchPrograms,
    data: programsData,
    isPending: isProgramsLoading,
  } = useGatcPrograms();

  useEffect(() => {
    if (speakerId) {
      fetchPrograms(speakerId);
    }
  }, [speakerId, fetchPrograms]);

  if (isSpeakerLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!speaker) {
    return <div className="p-8 text-slate-500">Speaker not found.</div>;
  }

  const handleBack = () => {
    router.history.back();
  };

  const programsContent = (
    <div className="mt-6">
      <ProgramList programs={programsData || []} isLoading={isProgramsLoading} />
    </div>
  );

  const profileContent = (
    <div className="mt-6 flex flex-col gap-8 md:flex-row">
      <div className="flex-1">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar Component */}
          <div className="h-40 w-40 shrink-0 overflow-hidden rounded-full bg-blue-50 shadow-sm">
            <img
              src={speaker.profile_image || getAvatarByName({ firstName: speaker.first_name, lastName: speaker.last_name })}
              alt={speaker.first_name}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-4 text-slate-600">
              <LinkedinOutlined className="text-xl hover:text-emerald-600 cursor-pointer transition-colors" />
              <TwitterOutlined className="text-xl hover:text-emerald-600 cursor-pointer transition-colors" />
              <GlobalOutlined className="text-xl hover:text-emerald-600 cursor-pointer transition-colors" />
            </div>
            
            <h1 className="mt-2 text-3xl font-semibold text-slate-800">
              {speaker.first_name} {speaker.middle_name ? `${speaker.middle_name} ` : ""}{speaker.last_name}
            </h1>
            
            {speaker.email && (
              <p className="text-sm text-slate-500">
                <span className="mr-2">Email: {speaker.email}</span>
                <span className="mr-2 text-slate-300">•</span>
                <span>ID: {speaker.id}</span>
              </p>
            )}
            
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded bg-emerald-500 px-3 py-1 text-sm font-medium text-white shadow-sm">
                Subject Matter Expert
              </span>
              <span className="rounded bg-emerald-500 px-3 py-1 text-sm font-medium text-white shadow-sm">
                Speaker
              </span>
            </div>
          </div>
          
          <div className="shrink-0">
            <Button 
              type="primary" 
              className="bg-emerald-600 font-medium hover:bg-emerald-500"
            >
              Send Handshake
            </Button>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">About</h2>
          <p className="text-slate-600 leading-relaxed max-w-4xl">
            {speaker.first_name} {speaker.last_name} is a speaker for the upcoming GATC program. 
            Currently, their full bio is not available. Please reach out or connect 
            via a handshake for more details directly from the speaker.
          </p>
        </div>

        {/* Small Programs Preview in Profile tab */}
        <div className="w-full">
          <h2 className="mb-4 text-xl font-semibold text-slate-800 border-b border-gray-100 pb-2">Programs at GATC</h2>
          <div className="flex flex-col mt-4">
             {programsData && programsData.length > 0 ? (
                 programsData.map(prog => (
                   <ProgramCard key={prog.id} program={prog} />
                 ))
             ) : (
               <span className="text-sm text-slate-500">No specific programs registered yet.</span>
             )}
          </div>
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div className="w-full md:w-80 shrink-0">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Quick Actions</h3>
          <Button block className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-white p-6">
      <Button 
        onClick={handleBack} 
        icon={<ArrowLeftOutlined />} 
        type="default"
        className="mb-6 rounded-md hover:border-emerald-500 hover:text-emerald-500"
      >
        Back
      </Button>
      
      <Tabs 
        defaultActiveKey="profile" 
        items={[
          { key: 'profile', label: 'Profile', children: profileContent },
          { key: 'programs', label: 'GATC Programs', children: programsContent },
        ]} 
        className="gatc-speaker-tabs"
      />
    </div>
  );
};

export default GatcSpeakerDetails;
