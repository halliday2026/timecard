import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { TimeEntry, ChartDataPoint } from "@/types/database";

function getLast10Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 9; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const days = getLast10Days();
  const startDate = days[0];
  const endDate = days[days.length - 1];

  const { data: entries } = await supabase
    .from("time_entries")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  const typedEntries: TimeEntry[] = (entries as TimeEntry[]) || [];

  // Build chart data with all 10 days (even if no entry)
  const chartData: ChartDataPoint[] = days.map((day) => {
    const dayEntries = typedEntries.filter((e) => e.date === day);
    const totalHours = dayEntries.reduce(
      (sum, e) => sum + (e.hours_worked || 0),
      0
    );
    return {
      date: day,
      displayDate: formatDisplayDate(day),
      hours: totalHours,
    };
  });

  return <DashboardClient chartData={chartData} entries={typedEntries} />;
}
