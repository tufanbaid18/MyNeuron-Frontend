import { Avatar, Typography } from "antd";
import { getAvatarByName } from "../../../utils/avatar.utils";
import type { GatcProgramsItem } from "../../../types/gatc/gatc.types";
import { Mic, Coffee, Info, MapPin, User } from "lucide-react";

const { Text, Title } = Typography;

interface ProgramCardProps {
  program: GatcProgramsItem;
  isLast?: boolean;
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  const [hourStr, minuteStr] = timeStr.split(":");
  const h = parseInt(hourStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minuteStr} ${ampm}`;
};

export const ProgramCard = ({ program, isLast }: ProgramCardProps) => {
  const hasSpeaker =
    program.speaker_name && program.speaker_name.trim().length > 0;

  let avatarSrc = program.speaker_image || undefined;
  if (hasSpeaker && !program.speaker_image) {
    const nameParts = program.speaker_name!.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || undefined;
    avatarSrc = getAvatarByName({ firstName, lastName });
  }

  const topicLower = program.topic.toLowerCase();
  let EventIcon = Mic;
  let iconGradient = "from-blue-500 to-indigo-600 shadow-blue-500/40";
  let borderHover = "hover:border-indigo-200 hover:shadow-indigo-100";

  if (topicLower.includes("tea") || topicLower.includes("lunch")) {
    EventIcon = Coffee;
    iconGradient = "from-orange-400 to-red-500 shadow-orange-500/40";
    borderHover = "hover:border-orange-200 hover:shadow-orange-100";
  } else if (topicLower.includes("registration") || topicLower.includes("valedictory") || topicLower.includes("cultural")) {
    EventIcon = Info;
    iconGradient = "from-emerald-400 to-teal-500 shadow-emerald-500/40";
    borderHover = "hover:border-emerald-200 hover:shadow-emerald-100";
  } else if (topicLower.includes("panel")) {
    EventIcon = Mic;
    iconGradient = "from-purple-500 to-fuchsia-500 shadow-purple-500/40";
    borderHover = "hover:border-purple-200 hover:shadow-purple-100";
  }

  return (
    <div className="relative flex w-full max-w-4xl gap-4 sm:gap-8 mx-auto -mb-1 group">
      {/* Timeline core */}
      <div className="flex flex-col items-center">
        {/* Glowy Icon Node */}
        <div className={`relative z-10 flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${iconGradient} shadow-lg ring-4 ring-white transition-transform duration-300 group-hover:scale-110`}>
          <EventIcon className="h-5 w-5 sm:h-7 sm:w-7 text-white" strokeWidth={2.5} />
        </div>
        {/* Connection Line */}
        {!isLast && (
          <div className="w-px flex-1 bg-linear-to-b from-gray-200 to-gray-100 group-hover:from-gray-300 mt-2" />
        )}
      </div>

      {/* Card Content */}
      <div className={`flex-1 pb-10 sm:pb-12 pt-1 transition-all duration-300 group-hover:-translate-y-1`}>
        <div className={`relative overflow-hidden rounded-2xl bg-white/80 p-5 sm:p-7 shadow-sm ring-1 ring-gray-100 backdrop-blur-md transition-all duration-300 ${borderHover} hover:shadow-xl`}>
          {/* Glassmorphism subtle background gradient */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-linear-to-br from-indigo-50 to-transparent opacity-50 blur-3xl" />

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Left Portion: Time & Info */}
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="flex items-center rounded-lg bg-gray-900/5 px-2.5 py-1 text-sm font-semibold tracking-wide text-gray-800">
                  {formatTime(program.start_time)} - {formatTime(program.end_time)}
                </span>
                {program.event_name && (
                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                    {program.event_name}
                  </span>
                )}
              </div>

              <Title level={4} className="mb-2! mt-2! font-bold leading-tight text-gray-900">
                {program.topic}
              </Title>

              {program.venue && (
                <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {program.venue}
                </div>
              )}
            </div>

            {/* Right Portion: Speaker */}
            {hasSpeaker && (
              <div className="mt-4 flex shrink-0 items-center gap-4 rounded-xl bg-gray-50/50 p-3 ring-1 ring-gray-100 lg:mt-0 lg:w-64 lg:justify-start">
                <Avatar
                  size={56}
                  src={avatarSrc}
                  icon={!avatarSrc && <User className="h-6 w-6" />}
                  className="shrink-0 border-2 border-white shadow-sm ring-1 ring-gray-200"
                  style={{ objectFit: 'cover' }}
                />
                <div className="flex flex-col justify-center overflow-hidden">
                  <Text className="truncate text-base font-bold text-gray-900">
                    {program.speaker_name}
                  </Text>
                  <Text className="text-xs font-semibold tracking-wider text-indigo-500 uppercase">
                    Speaker
                  </Text>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
