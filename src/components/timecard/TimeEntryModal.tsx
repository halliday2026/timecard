"use client";

import { useState, useEffect, useCallback } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { saveTimeEntry, deleteTimeEntry } from "@/app/(app)/dashboard/actions";
import type { TimeEntry } from "@/types/database";

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editEntry?: TimeEntry | null;
  defaultDate?: string;
}

function calculateHours(start: string, end: string): number {
  if (!start || !end) return 0;
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const diff = endMinutes - startMinutes;
  return diff > 0 ? Math.round((diff / 60) * 100) / 100 : 0;
}

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function TimeEntryModal({
  isOpen,
  onClose,
  editEntry,
  defaultDate,
}: TimeEntryModalProps) {
  const geo = useGeolocation();

  const [date, setDate] = useState(defaultDate || todayString());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Populate fields when editing or when geo data arrives
  useEffect(() => {
    if (editEntry) {
      setDate(editEntry.date);
      setStartTime(editEntry.start_time || "");
      setEndTime(editEntry.end_time || "");
      setCity(editEntry.city || "");
      setState(editEntry.state || "");
      setNotes(editEntry.notes || "");
    } else {
      setDate(defaultDate || todayString());
      setStartTime("");
      setEndTime("");
      setNotes("");
      // Use geo data for new entries
      if (geo.city) setCity(geo.city);
      if (geo.state) setState(geo.state);
    }
    setError("");
    setSuccess("");
  }, [editEntry, defaultDate, isOpen, geo.city, geo.state]);

  const hoursWorked = calculateHours(startTime, endTime);

  const handleSave = useCallback(async () => {
    setError("");

    if (!date || !startTime || !endTime) {
      setError("Date, start time, and end time are required.");
      return;
    }

    if (hoursWorked <= 0) {
      setError("End time must be after start time.");
      return;
    }

    setSaving(true);

    const result = await saveTimeEntry({
      id: editEntry?.id,
      date,
      start_time: startTime,
      end_time: endTime,
      hours_worked: hoursWorked,
      city,
      state,
      notes,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Saved!");
      setTimeout(() => {
        onClose();
      }, 500);
    }
  }, [date, startTime, endTime, hoursWorked, city, state, notes, editEntry, onClose]);

  const handleDelete = useCallback(async () => {
    if (!editEntry?.id) return;
    if (!confirm("Delete this time entry?")) return;

    setDeleting(true);
    const result = await deleteTimeEntry(editEntry.id);
    setDeleting(false);

    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  }, [editEntry, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl">
        <h2 className="mb-4 text-xl font-bold">
          {editEntry ? "Edit Time Entry" : "Log Time"}
        </h2>

        {error && (
          <div className="mb-3 rounded-lg bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            {success}
          </div>
        )}

        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-muted">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Hours display */}
          {startTime && endTime && (
            <div className="rounded-lg bg-primary/5 px-4 py-2 text-center text-sm font-medium">
              {hoursWorked > 0 ? (
                <span className="text-primary">
                  {hoursWorked.toFixed(2)} hours
                </span>
              ) : (
                <span className="text-danger">
                  End time must be after start time
                </span>
              )}
            </div>
          )}

          {/* Location row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                City {geo.loading && <span className="text-xs">(detecting...)</span>}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter state"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {geo.error && !editEntry && (
            <p className="text-xs text-muted">{geo.error}</p>
          )}

          {/* Notes */}
          <div>
            <label className="mb-1 block text-sm font-medium text-muted">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="What did you work on?"
              className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {editEntry && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg border border-danger px-4 py-3 text-sm font-medium text-danger transition-colors hover:bg-danger hover:text-white disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            )}
            <div className="flex flex-1 gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
