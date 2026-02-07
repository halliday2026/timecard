export interface TimeEntry {
  id: string;
  user_id: string;
  date: string;
  hours_worked: number | null;
  start_time: string | null;
  end_time: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimeEntryInsert {
  user_id: string;
  date: string;
  hours_worked?: number | null;
  start_time?: string | null;
  end_time?: string | null;
  city?: string | null;
  state?: string | null;
  notes?: string | null;
}

export interface TimeEntryUpdate {
  date?: string;
  hours_worked?: number | null;
  start_time?: string | null;
  end_time?: string | null;
  city?: string | null;
  state?: string | null;
  notes?: string | null;
  updated_at?: string;
}

export interface ChartDataPoint {
  date: string;
  hours: number;
  displayDate: string;
}
