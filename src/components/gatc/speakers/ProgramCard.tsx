import { Avatar } from "antd";
import { getAvatarByName } from "../../../utils/avatar.utils";
import type { GatcProgramsItem } from "../../../types/gatc/gatc.types";
import { ClockCircleOutlined, AudioOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { User } from "lucide-react";

interface ProgramCardProps {
  program: GatcProgramsItem;
  isLast?: boolean;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return { day: "", month: "" };
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return { day: "", month: "" };
  
  return {
    day: date.toLocaleDateString("en-US", { day: "numeric" }),
    month: date.toLocaleDateString("en-US", { month: "short" })
  };
};

export const ProgramCard = ({ program }: ProgramCardProps) => {
  const hasSpeaker =
    program.speaker_name && program.speaker_name.trim().length > 0;

  let avatarSrc = program.speaker_image || undefined;
  if (hasSpeaker && !program.speaker_image) {
    const nameParts = program.speaker_name!.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || undefined;
    avatarSrc = getAvatarByName({ firstName, lastName });
  }

  const { day, month } = formatDate(program.date);

  return (
    <div className="mb-6 w-full max-w-4xl mx-auto">
      {/* Event Tag */}
      {program.event_name && (
        <div className="mb-3 inline-block rounded border border-emerald-500 px-3 py-1 text-sm text-emerald-600 bg-white">
          {program.event_name}
        </div>
      )}
      
      {/* Main Card */}
      <div className="flex rounded-md border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Date Section */}
        <div className="flex w-24 flex-col items-center justify-center p-4">
          <span className="text-xl font-bold text-gray-800">{day}</span>
          <span className="text-sm font-medium text-gray-500">{month}</span>
        </div>
        
        {/* Vertical Divider */}
        <div className="my-4 w-px bg-gray-200" />
        
        {/* Details Section */}
        <div className="flex flex-1 items-center justify-between p-4 pl-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-gray-800">{program.topic}</h3>
            
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <ClockCircleOutlined className="mr-2" />
              <span>{program.start_time} - {program.end_time}</span>
            </div>
            
            {program.venue && (
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <EnvironmentOutlined className="mr-2" />
                <span>{program.venue}</span>
              </div>
            )}
            
            {/* Speaker Information included if available */}
            {hasSpeaker && (
              <div className="mt-3 flex items-center gap-2">
                <Avatar 
                  size={24} 
                  src={avatarSrc} 
                  icon={!avatarSrc && <User className="h-3 w-3" />}
                />
                <span className="text-sm font-medium text-gray-700">{program.speaker_name}</span>
              </div>
            )}
          </div>
          
          <div className="ml-4 shrink-0 pr-4">
            <AudioOutlined className="text-2xl text-emerald-600 opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
};
