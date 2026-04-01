import { supabase } from "../../libs/supabase/client";
import { create } from "zustand";
import { useAuthStore } from "./auth.store";

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

type ChatType = "dm" | "group";

type Action = {
  messages: Record<string, Message[]>;
  subscriptions: Record<string, any>;

  getAllMessages: (
    room_id: string,
    type: ChatType, // "dm" or "group"
    before?: string,
  ) => Promise<Message[] | null>;

  sendMessage: (data: {
    room_id: string;
    type: ChatType;
    message: string;
  }) => Promise<void | null>;

  subscribeRoom: (room_id: string, type: ChatType) => void;
  unsubscribeRoom: (room_id: string) => void;
};

export const useChatDetailStore = create<Action>((set, get) => ({
  messages: {},
  subscriptions: {},

  // get messages
  getAllMessages: async (
    room_id: string,
    type: string, // "dm" or "group"
    before?: string,
  ): Promise<Message[] | null> => {
    let query;
    if (type === "dm") {
      query = supabase
        .from("dm_message")
        .select("id, friend_id, content, sender_id, created_at")
        .eq("friend_id", room_id)
        .order("created_at", { ascending: false })
        .limit(30);
    } else {
      query = supabase
        .from("group_message")
        .select("id, event_id, content, sender_id, created_at")
        .eq("event_id", room_id)
        .order("created_at", { ascending: false })
        .limit(30);
    }

    if (before) {
      query = query.lt("created_at", before);
    }

    const { data: messages, error: getMsgsErr } = await query;

    if (!messages || getMsgsErr) {
      console.log("Failed to fetch messages", getMsgsErr);
      return null;
    }

    const mapped: Message[] = messages.map((m: any) => ({
      id: m.id,
      room_id: type === "dm" ? m.friend_id : m.event_id,
      sender_id: m.sender_id,
      message: m.content,
      created_at: m.created_at,
    }));

    //
    set((state) => ({
      messages: {
        ...state.messages,
        [room_id]: mapped.reverse(),
      },
    }));

    console.log(mapped);

    if (!mapped) return null;

    return mapped;
  },

  // Send messages
  sendMessage: async (data: {
    room_id: string;
    type: string;
    message: string;
  }): Promise<void> => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("Authentication required");

    let tableName = data.type === "dm" ? "dm_message" : "group_message";
    let payload =
      data.type === "dm"
        ? {
            friend_id: data.room_id,
            sender_id: currentUser.id,
            content: data.message,
          }
        : {
            event_id: data.room_id,
            sender_id: currentUser.id,
            content: data.message,
          };

    const { data: message, error } = await supabase
      .from(tableName)
      .insert(payload)
      .select()
      .single();

    if (!message || error) {
      console.log("Failed to send the message");
    }
  },

  subscribeRoom: (room_id, type) => {
    const existing = get().subscriptions[room_id];
    if (existing) return; // already subscribed

    const table = type === "dm" ? "dm_message" : "group_message";
    const filter =
      type === "dm" ? `friend_id=eq.${room_id}` : `event_id=eq.${room_id}`;

    const channel = supabase
      .channel(`${type}_${room_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table,
          filter,
        },
        (payload: any) => {
          const newMsg = payload.new;

          set((state) => {
            const currentRoomMessages = state.messages[room_id] || [];

            if (currentRoomMessages.some((m) => m.id === newMsg.id)) {
              return state;
            }

            const msg: Message = {
              id: newMsg.id,
              room_id: room_id,
              sender_id: newMsg.sender_id,
              message: newMsg.content,
              created_at: newMsg.created_at,
            };

            const updatedMessages = [...currentRoomMessages, msg].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime(),
            );

            return {
              messages: {
                ...state.messages,
                [room_id]: updatedMessages,
              },
            };
          });
        },
      )
      .subscribe();

    set((state) => ({
      subscriptions: {
        ...state.subscriptions,
        [room_id]: channel,
      },
      messages: {
        ...state.messages,
        [room_id]: state.messages[room_id] || [],
      },
    }));
  },
  unsubscribeRoom: (room_id) => {
    const channel = get().subscriptions[room_id];
    if (channel) {
      supabase.removeChannel(channel);
      set((state) => {
        const subs = { ...state.subscriptions };
        delete subs[room_id];
        return { subscriptions: subs };
      });
    }
  },
}));
