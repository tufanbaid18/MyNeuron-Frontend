import { useMemo } from "react";
import { Tabs, Empty, Spin } from "antd";
import type { GatcProgramsItem } from "../../../types/gatc/gatc.types";
import { ProgramCard } from "./ProgramCard";

interface ProgramListProps {
  programs: GatcProgramsItem[];
  isLoading: boolean;
}

export const ProgramList = ({ programs, isLoading }: ProgramListProps) => {
  // Group programs by date and sort each day's items by start_time
  const groupedPrograms = useMemo(() => {
    if (!programs || !Array.isArray(programs)) return {};

    const groups = programs.reduce(
      (acc, program) => {
        const date = program.date; // format: "2026-03-11"
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(program);
        return acc;
      },
      {} as Record<string, GatcProgramsItem[]>
    );

    // Sort items within each date group
    Object.keys(groups).forEach((date) => {
      groups[date].sort((a, b) => {
        return a.start_time.localeCompare(b.start_time);
      });
    });

    return groups;
  }, [programs]);

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

  const formatDateForTab = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const datesAscending = Object.keys(groupedPrograms).sort();

  const tabsItems = datesAscending.map((dateStr, index) => {
    return {
      key: dateStr,
      label: (
        <div className="px-4 py-1 text-center">
          <div className="text-base font-semibold">
            {formatDateForTab(dateStr)}
          </div>
          <div className="text-xs font-normal text-gray-500">
            Day {index + 1}
          </div>
        </div>
      ),
      children: (
        <div className="animate-fade-in mx-auto max-w-4xl py-4 relative">
          {groupedPrograms[dateStr].map((program, idx) => (
            <ProgramCard 
              key={program.id} 
              program={program} 
              isLast={idx === groupedPrograms[dateStr].length - 1} 
            />
          ))}
        </div>
      ),
    };
  });

  return (
    <div className="w-full">
      <Tabs
        defaultActiveKey={tabsItems[0]?.key}
        items={tabsItems}
        size="large"
        centered
      />
    </div>
  );
};
