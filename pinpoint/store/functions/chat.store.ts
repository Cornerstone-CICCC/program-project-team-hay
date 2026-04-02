import { supabase } from "../../libs/supabase/client";
import { create } from "zustand";
import { useAuthStore } from "./auth.store";

type ChatType = "dm" | "group" | "past";

interface ChatRoom {
  room_id: string;
  type: "dm" | "group";
  name: string;
  image?: string;
  last_message?: string;
  last_message_at?: string;
}

type EventType = {
  id: string;
  name: string;
  date: string | null;
  imgKey: string | null;
};

type Action = {
  getChatList: (chatType: ChatType) => Promise<ChatRoom[] | null>;
};

export const useChatStore = create<Action>((set, get) => ({
  getChatList: async (chatType: ChatType): Promise<ChatRoom[] | null> => {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error("Authentication required");

      if (chatType === "dm") {
        const { data: friends, error: selectDmErr } = await supabase
          .from("friend")
          .select("*")
          .or(
            `user_id.eq.${currentUser.id}, friend_user_id.eq.${currentUser.id}`,
          );

        if (!friends || friends.length === 0) {
          console.log("Not found friend(dm room)");
          return null;
        }

        if (selectDmErr) {
          console.log("Error selecting friend(dm) list", selectDmErr);
          return null;
        }

        const dmIds = friends.map((f) => f.id);

        const { data: messages, error: selectMsgErr } = await supabase
          .from("dm_message")
          .select("friend_id, content, created_at")
          .in("friend_id", dmIds)
          .order("created_at", { ascending: false });

        if (selectMsgErr) {
          console.log("Error selecting friend(dm) list", selectMsgErr);
          return null;
        }

        const lastMsgMap = new Map();

        if (messages) {
          for (const msg of messages) {
            if (!lastMsgMap.has(msg.friend_id)) {
              lastMsgMap.set(msg.friend_id, msg);
            }
          }
        }

        // friend_user_ids
        const friendUserIds = friends.map((f) =>
          f.user_id === currentUser.id ? f.friend_user_id : f.user_id,
        );

        // select profiles of friend_user
        const { data: profiles, error: selectProsErr } = await supabase
          .from("profiles")
          .select("id, name, profile_image_url")
          .in("id", friendUserIds);

        if (!profiles || selectProsErr) {
          console.log("Error selecting friend's profile ", selectProsErr);
          return null;
        }

        const details: ChatRoom[] = friends
          .map((f): ChatRoom | null => {
            const friendUserId =
              f.user_id === currentUser.id ? f.friend_user_id : f.user_id;
            const profile = profiles.find((p) => p.id === friendUserId);
            if (!profile) return null;

            const lastMsg = lastMsgMap.get(f.id);

            return {
              room_id: f.id,
              type: "dm",
              name: profile.name,
              image: profile.profile_image_url,
              last_message: lastMsg?.content ?? null,
              last_message_at: lastMsg?.created_at ?? null,
            };
          })
          .filter((item): item is ChatRoom => item !== null)
          .sort((a, b) => {
            const dateA = a.last_message_at
              ? new Date(a.last_message_at).getTime()
              : 0;
            const dateB = b.last_message_at
              ? new Date(b.last_message_at).getTime()
              : 0;
            return dateB - dateA;
          });
        console.log(details);

        return details;
      } else {
        const isPast = chatType === "past";

        const { data: userEvents, error: selectGroupErr } = await supabase
          .from("user_event")
          .select(
            `
            event:event_id (
              id,
              name,
              date,
              imgKey
            )
            `,
          )
          .eq("user_id", currentUser.id);

        if (!userEvents) {
          console.log("The user hasn't had any group chat");
          return [];
        }

        if (selectGroupErr) {
          console.log("Error selecting group chat list", selectGroupErr);
          return [];
        }

        const rawEvents = userEvents
          .map((ue) => ue.event)
          .filter(Boolean) as unknown as EventType[];
        const eventIds = rawEvents.map((e) => e.id);

        const { data: messages, error: selectMsgErr } = await supabase
          .from("group_message")
          .select("event_id, content, created_at")
          .in("event_id", eventIds)
          .order("created_at", { ascending: false });

        if (selectMsgErr) {
          console.log("Error selecting messages");
          return null;
        }

        const lastMsgMap = new Map();

        if (messages) {
          for (const msg of messages) {
            if (!lastMsgMap.has(msg.event_id)) {
              lastMsgMap.set(msg.event_id, msg);
            }
          }
        }

        const now = new Date();

        const details = rawEvents
          .filter((e) => {
            if (!e.date) return !isPast;

            const eventDate = new Date(e.date);
            eventDate.setHours(23, 59, 59, 999);

            return isPast ? now > eventDate : now <= eventDate;
          })
          .map((e) => {
            const lastMsg = lastMsgMap.get(e.id);

            return {
              room_id: e.id,
              type: "group",
              name: e.name,
              last_message: lastMsg?.content ?? null,
              last_message_at: lastMsg?.created_at ?? null,
            };
          })
          .sort((a, b) => {
            const dateA = a.last_message_at
              ? new Date(a.last_message_at).getTime()
              : 0;
            const dateB = b.last_message_at
              ? new Date(b.last_message_at).getTime()
              : 0;
            return dateB - dateA;
          });

        console.log(details);
        return details as ChatRoom[];
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },
}));
