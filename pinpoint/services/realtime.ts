import { supabase } from "../libs/supabase/client";

export const subscribeToDm = (
  roomId: string,
  onMessage: (msg: any) => void,
) => {
  const channel = supabase
    .channel(`dm_${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "dm_message",
        filter: `friend_id=eq.${roomId}`,
      },
      (payload) => {
        onMessage(payload.new);
      },
    )
    .subscribe();

  return channel;
};

export const subscribeToGroup = (
  roomId: string,
  onMessage: (msg: any) => void,
) => {
  const channel = supabase
    .channel(`group_${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "group_message",
        filter: `event_id=eq.${roomId}`,
      },
      (payload) => {
        onMessage(payload.new);
      },
    )
    .subscribe();

  return channel;
};
