"use client";

import { useState, useCallback } from "react";
import { HoursBarChart } from "@/components/charts/HoursBarChart";
import { TimeEntryModal } from "@/components/timecard/TimeEntryModal";
import { EmptyState } from "@/components/ui/EmptyState";
import type { TimeEntry, ChartDataPoint } from "@/types/database";

interface DashboardClientProps {
  chartData: ChartDataPoint[];
  entries: TimeEntry[];
}

export function DashboardClient({ chartData, entries }: DashboardClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<TimeEntry | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>();

  const handleBarClick = useCallback(
    (date: string) => {
      // Find the entry for the clicked date
      const entry = entries.find((e) => e.date === date);
      if (entry) {
        setEditEntry(entry);
        setDefaultDate(undefined);
      } else {
        setEditEntry(null);
        setDefaultDate(date);
      }
      setModalOpen(true);
    },
    [entries]
  );

  const handleLogTime = useCallback(() => {
    setEditEntry(null);
    setDefaultDate(undefined);
    setModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setEditEntry(null);
    setDefaultDate(undefined);
  }, []);

  const hasData = chartData.some((d) => d.hours > 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Upper half: Chart */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-lg font-semibold">Last 10 Days</h2>
        {hasData ? (
          <HoursBarChart data={chartData} onBarClick={handleBarClick} />
        ) : (
          <EmptyState
            title="No time entries yet"
            description="Tap 'Log Time' below to record your first entry."
          />
        )}
      </div>

      {/* Lower half: Log Time button */}
      <button
        onClick={handleLogTime}
        className="w-full rounded-xl bg-primary px-6 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-primary-hover active:scale-[0.98]"
      >
        + Log Time
      </button>

      {/* Modal */}
      <TimeEntryModal
        isOpen={modalOpen}
        onClose={handleClose}
        editEntry={editEntry}
        defaultDate={defaultDate}
      />
    </div>
  );
}
