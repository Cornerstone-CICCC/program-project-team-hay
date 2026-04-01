import { supabase } from "../../libs/supabase/client";
import { create } from "zustand";
import { useAuthStore } from "./auth.store";

interface EventOverview {
  event_id: string;
  name: string;
  date?: string;
  address?: string;
}

type Action = {
  getHomeEventList: () => Promise<EventOverview[] | null>;

  getRecentFriends: () => Promise<
    | {
        friend_id: string;
        friend_userId: string;
        friend_image: string;
        friend_name: string;
      }[]
    | null
  >;
};

export const useHomeStore = create<Action>((set, get) => ({
  getHomeEventList: async (): Promise<EventOverview[] | null> => {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error("Authentication required");
      const { data: userEvents, error: selectUserEventsErr } = await supabase
        .from("user_event")
        .select("event_id")
        .eq("user_id", currentUser.id);

      if (selectUserEventsErr) {
        console.log("Error selecting events in the userEvents table by userId");
        return null;
      }
      if (!userEvents) {
        console.log("Any event doesn't exist");
        return null;
      }

      const eventIds = userEvents.map((ue) => ue.event_id);

      const now = new Date().toISOString();
      const { data: events, error: selectEventsErr } = await supabase
        .from("event")
        .select("id, name, date, address")
        .in("id", eventIds)
        .not("date", "is", null)
        .gte("date", now)
        .order("date", { ascending: true })
        .limit(3);

      if (selectEventsErr || !events) {
        console.log("Error selecting events in the event table");
        return null;
      }

      const details = events.map((e) => ({
        event_id: e.id,
        name: e.name,
        date: e.date,
        address: e.address,
      }));

      console.log(details);

      return details;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getRecentFriends: async (): Promise<
    | {
        friend_id: string;
        friend_userId: string;
        friend_image: string;
        friend_name: string;
      }[]
    | null
  > => {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error("Authentication required");

      const { data: friends, error: selectFriendsErr } = await supabase
        .from("friend")
        .select("*")
        .or(
          `user_id.eq.${currentUser.id}, friend_user_id.eq.${currentUser.id}`,
        );

      if (selectFriendsErr) {
        console.log("Error selecting dm list in the friend table by userId");
        return null;
      }

      if (!friends) {
        console.log("You don't have any friends to chat yet");
        return null;
      }

      const friendIds = friends.map((f) => f.id);

      const { data: messages, error: msgErr } = await supabase
        .from("dm_message")
        .select("friend_id, content, created_at")
        .in("friend_id", friendIds)
        .order("created_at", { ascending: false });

      if (msgErr || !messages || messages.length === 0) {
        console.log("You don't have any friends to chat yet");
        return [];
      }

      const latestMap = new Map();
      for (const msg of messages) {
        if (!latestMap.has(msg.friend_id)) {
          latestMap.set(msg.friend_id, msg);
          if (latestMap.size === 3) break;
        }
      }
      const latestMessages = Array.from(latestMap.values());

      const friendUsersIds = latestMessages.map((msg) => {
        const friend = friends.find((f) => f.id === msg.friend_id);
        return friend.user_id === currentUser.id
          ? friend.friend_user_id
          : friend.user_id;
      });

      const { data: profiles, error: selectProfileErr } = await supabase
        .from("profiles")
        .select("id, name, profile_image_url")
        .in("id", friendUsersIds);

      if (!profiles || selectProfileErr) {
        console.log("Error selecting profile ");
        return null;
      }

      const details = latestMessages
        .map((msg) => {
          const friend = friends.find((f) => f.id === msg.friend_id);
          const friendUserId =
            friend.user_id === currentUser.id
              ? friend.friend_user_id
              : friend.user_id;
          const profile = profiles.find((p) => p.id === friendUserId);

          if (!profile) return null;

          return {
            friend_id: msg.friend_id,
            friend_userId: profile.id,
            friend_image: profile.profile_image_url,
            friend_name: profile.name,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      console.log(details);

      return details;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
}));
