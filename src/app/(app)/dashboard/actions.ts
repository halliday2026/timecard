"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface TimeEntryData {
  id?: string;
  date: string;
  start_time: string;
  end_time: string;
  hours_worked: number;
  city: string;
  state: string;
  notes: string;
}

export async function saveTimeEntry(data: TimeEntryData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  if (data.id) {
    // Update existing entry
    const { error } = await supabase
      .from("time_entries")
      .update({
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        hours_worked: data.hours_worked,
        city: data.city,
        state: data.state,
        notes: data.notes || null,
      })
      .eq("id", data.id)
      .eq("user_id", user.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Insert new entry
    const { error } = await supabase.from("time_entries").insert({
      user_id: user.id,
      date: data.date,
      start_time: data.start_time,
      end_time: data.end_time,
      hours_worked: data.hours_worked,
      city: data.city,
      state: data.state,
      notes: data.notes || null,
    });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteTimeEntry(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("time_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}
