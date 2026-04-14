import { supabase } from "../../libs/supabase/client";
import { create } from "zustand";
import { useAuthStore } from "./auth.store";

interface EventOverview {
  event_id: string;
  name: string;
  date?: string;
  address?: string;
}

type EventFilter = "upcoming" | "today" | "tomorrow" | "week" | "past"; // add "invited"

type Action = {
  getEventList: (
    filter: EventFilter,
    cursor?: string, // the last cursor of the previous response, it will be null at first
  ) => Promise<{
    events: EventOverview[];
    lastCursor?: string;
  } | null>;
};

export const useEventListStore = create<Action>((set, get) => ({
  getEventList: async (
    filter: EventFilter,
    cursor?: string, // the last time of the previous response
  ): Promise<{
    events: EventOverview[];
    lastCursor?: string;
  } | null> => {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error("Authentication required");

      const finalUserId = currentUser.id || useAuthStore.getState().user?.id;
      if (!finalUserId) {
        console.error("No User ID provided");
        return null;
      }

      const { data: userEvents, error: selectUserEventsErr } = await supabase
        .from("user_event")
        .select("event_id")
        .eq("user_id", finalUserId);

      if (!userEvents || selectUserEventsErr) {
        console.log("Error selecting user's events", selectUserEventsErr);
        return null;
      }

      const eventIds = userEvents.map((ue) => ue.event_id);
      if (eventIds.length === 0) return { events: [], lastCursor: undefined };

      const now = new Date();
      const format = (d: Date) => d.toISOString();

      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date(now);
      endOfToday.setHours(23, 59, 59, 999);

      const startOfTmr = new Date(now);
      startOfTmr.setDate(now.getDate() + 1);
      startOfTmr.setHours(0, 0, 0, 0);

      const endOfTmr = new Date(startOfTmr);
      endOfTmr.setHours(23, 59, 59, 999);

      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + 7);
      endOfWeek.setHours(23, 59, 59, 999);

      let query = supabase
        .from("event")
        .select("id, name, date, address")
        .in("id", eventIds)
        .not("date", "is", null)
        .limit(8);

      if (filter === "upcoming") {
        query = query.gte("date", format(now));
      } else if (filter === "today") {
        query = query.gte("date", format(now)).lte("date", format(endOfToday));
      } else if (filter === "tomorrow") {
        query = query
          .gte("date", format(startOfTmr))
          .lte("date", format(endOfTmr));
      } else if (filter === "week") {
        query = query.gte("date", format(now)).lte("date", format(endOfWeek));
      } else if (filter === "past") {
        query = query.lt("date", format(now));
      }

      query = query.order("id", { ascending: true });

      if (cursor) {
        query = query.gt("id", cursor);
      }

      const { data: events, error: selectEventsErr } = await query;

      if (selectEventsErr || !events) return null;

      const result = events.map((e) => ({
        event_id: e.id,
        name: e.name,
        date: e.date,
        address: e.address,
      }));

      const lastCursor = events?.[events.length - 1]?.id;

      const details = {
        events: result,
        lastCursor,
      };

      console.log(details);

      return details;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
}));
