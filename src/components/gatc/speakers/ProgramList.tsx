import { UserOutlined } from "@ant-design/icons";
import { Avatar, Empty, Spin } from "antd";
import { useMemo, useState } from "react";
import type { GatcProgramsItem } from "../../../types/gatc/gatc.types";
import { getAvatarByName } from "../../../utils/avatar.utils";

interface ProgramListProps {
  programs: GatcProgramsItem[];
  isLoading: boolean;
}

export const ProgramList = ({ programs, isLoading }: ProgramListProps) => {
  // Extract unique events for the top filter (if multiple) or just default to first
  const events = useMemo(() => {
    if (!programs) return [];
    const unique = new Set(programs.map((p) => p.event_name));
    return Array.from(unique);
  }, [programs]);

  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  // const currentEvent = activeEvent || events[0] || null;
  const currentEvent = activeEvent || events[0] || null;

  // Filter programs by active event
  const filteredByEvent = useMemo(() => {
    if (!programs) return [];
    return programs.filter((p) => p.event_name === currentEvent);
  }, [programs, currentEvent]);

  // Group by date
  const groupedPrograms = useMemo(() => {
    const groups = filteredByEvent.reduce(
      (acc, program) => {
        const date = program.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(program);
        return acc;
      },
      {} as Record<string, GatcProgramsItem[]>,
    );

    Object.keys(groups).forEach((date) => {
      groups[date].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });

    return groups;
  }, [filteredByEvent]);

  const datesAscending = Object.keys(groupedPrograms).sort();
  const [activeDate, setActiveDate] = useState<string | null>(null);

  // const currentDate = activeDate || datesAscending[0] || null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" tip="Loading Schedule..." />
      </div>
    );
  }

  if (!programs || programs.length === 0) {
    return <Empty description="No schedule available yet." className="py-20" />;
  }

  const formatTabDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    });
  };

  const formatCardDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB"); // 11/03/2026
  };

  // const programsToDisplay = currentDate ? groupedPrograms[currentDate] : [];

  const programsToDisplay = activeDate
    ? groupedPrograms[activeDate] || []
    : Object.values(groupedPrograms).flat();

  // Get unique venues for the current date to display as headers
  const uniqueVenues = Array.from(
    new Set(programsToDisplay.map((p) => p.venue).filter(Boolean)),
  );

  return (
    <div className="w-full">
      {/* Top Event Pills */}
      {events.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {events.map((event) => (
            <div
              key={event}
              onClick={() => setActiveEvent(event)}
              className={`cursor-pointer rounded-full px-6 py-2 font-medium transition-colors ${
                currentEvent === event
                  ? "bg-[#64A347] text-white"
                  : "bg-white text-[#64A347] border border-[#64A347] hover:bg-emerald-50"
              }`}
            >
              {event}
            </div>
          ))}
        </div>
      )}

      {/* Date Radio Buttons */}
      {datesAscending.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          <div
            onClick={() => setActiveDate(null)}
            className={`cursor-pointer rounded-full px-5 py-2 font-medium transition-colors ${
              activeDate === null
                ? "bg-[#64A347] border border-[#64A347] text-white"
                : "bg-white border border-[#64A347] text-[#64A347] hover:bg-emerald-50"
            }`}
          >
            All
          </div>
          {datesAscending.map((date) => {
            const isActive = activeDate === date;
            return (
              <div
                key={date}
                onClick={() => setActiveDate(date)}
                className={`cursor-pointer rounded-full px-5 py-2 font-medium transition-colors ${
                  isActive
                    ? "bg-[#64A347] border border-[#64A347] text-white"
                    : "bg-white border border-[#64A347] text-[#64A347] hover:bg-emerald-50"
                }`}
              >
                {formatTabDate(date)}
              </div>
            );
          })}
        </div>
      )}

      {/* Venues and Grid */}
      {uniqueVenues.length > 0 ? (
        uniqueVenues.map((venue) => {
          const venuePrograms = programsToDisplay.filter(
            (p) => p.venue === venue,
          );
          return (
            <div key={venue} className="mb-10">
              <h2 className="mb-6 text-xl font-bold text-[#143B54]">
                Venue: {venue}
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {venuePrograms.map((program) => {
                  const hasSpeaker =
                    program.speaker_name &&
                    program.speaker_name.trim().length > 0;
                  // Handle avatar
                  let avatarSrc = program.speaker_image || undefined;
                  if (hasSpeaker && !program.speaker_image) {
                    const nameParts = program.speaker_name!.trim().split(" ");
                    avatarSrc = getAvatarByName({
                      firstName: nameParts[0],
                      lastName: nameParts.slice(1).join(" ") || undefined,
                    });
                  }

                  return (
                    <div
                      key={program.id}
                      className="flex flex-col rounded-2xl bg-white p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100"
                    >
                      {/* Top Time Pill */}
                      <div className="mb-4 self-start rounded-full bg-[#64A347] px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
                        {program.start_time} — {program.end_time}
                      </div>

                      {/* Topic */}
                      <h3 className="mb-4 text-lg font-bold text-gray-900 leading-tight">
                        {program.topic}
                      </h3>

                      {/* Speaker */}
                      {hasSpeaker && (
                        <div className="mb-6 flex items-center gap-3">
                          <Avatar
                            size={40}
                            src={avatarSrc}
                            icon={!avatarSrc && <UserOutlined />}
                            className="bg-gray-100 border border-gray-200"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">
                              {program.speaker_name}
                            </span>
                            <span className="text-xs font-medium text-gray-500">
                              Speaker
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Empty space pusher to keep footer at bottom if heights vary */}
                      <div className="flex-1"></div>

                      {/* Dashed divider */}
                      <div className="my-4 border-t border-dashed border-gray-200"></div>

                      {/* Footer: Venue & Date */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="rounded bg-blue-50/70 px-2 py-1 flex-1 min-w-0">
                          <span className="text-[10px] font-semibold text-blue-800 uppercase tracking-wide truncate block">
                            {program.venue}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-400 shrink-0">
                          {formatCardDate(program.date)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Fallback if somehow venue is empty on elements */}
          {programsToDisplay.map((program) => (
            <div
              key={program.id}
              className="flex flex-col rounded-2xl bg-white p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100"
            >
              {/* Same content here if needed */}
              <div className="mb-4 self-start rounded-full bg-[#64A347] px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
                {program.start_time} — {program.end_time}
              </div>
              <h3 className="mb-2 text-lg font-bold text-[#143B54]">
                {program.topic}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
