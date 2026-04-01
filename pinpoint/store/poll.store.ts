import { supabase } from "../libs/supabase/client";
import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  public_code: string;
  login_type: string;
  profileImage?: string;
  onboardingCompleted?: boolean;
}

interface PollOption {
  option_id: string;
  label: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  url?: string;
  imgKey?: string;
  votes?: Vote[];
}

interface Vote {
  id: string;
  option_id: string;
  userId: string;
}

type Type = "date" | "place";

type Action = {
  createNewPoll: (
    newPoll: {
      title: string;
      event_id: string;
      type: Type;
    },
    pollOptions: Omit<PollOption, "option_id">[],
  ) => Promise<{
    poll_id: string;
    event_id: string;
    title: string;
    is_active: boolean;
    type: string;
    options: PollOption[];
  } | null>;

  updatePollById: (poll_id: string) => Promise<void>;
};

export const usePollStore = create<Action>((set, get) => ({
  createNewPoll: async (
    newPoll: {
      title: string;
      event_id: string;
      type: "date" | "place";
    },
    pollOptions: Omit<PollOption, "option_id">[],
  ): Promise<{
    poll_id: string;
    event_id: string;
    title: string;
    is_active: boolean;
    type: string;
    options: PollOption[];
  } | null> => {
    try {
      // select a row to see if a active poll of the same type is already existing
      const { data: selectPoll, error: selectPollErr } = await supabase
        .from("poll")
        .select("*")
        .eq("event_id", newPoll.event_id)
        .eq("is_active", true);

      if (selectPollErr) {
        console.error("Error selecting poll: ", selectPollErr);
        return null;
      }

      if (selectPoll && selectPoll.length > 0) {
        const existsSameType = selectPoll.some((p) => p.type === newPoll.type);

        if (existsSameType) {
          console.error(
            "A poll of the same type is already active. If you want to continue creating a new poll of the same type, you need to make sure to delete the existing one.",
          );
          return null;
        }

        // if more than two polls are existing,
        if (selectPoll.length >= 2) {
          console.error("You can only have up to two polls");
          return null;
        }
      }

      // create a row for poll table
      const { data: poll, error: createPollErr } = await supabase
        .from("poll")
        .insert([
          {
            event_id: newPoll.event_id,
            title: newPoll.title,
            type: newPoll.type,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (!poll || createPollErr) {
        console.error("Error creating poll: ", createPollErr);
        return null;
      }

      // create user_event rows
      const rows = pollOptions.map((o) => ({
        poll_id: poll.id,
        label: o.label,
        url: o.url,
        latitude: o.latitude,
        longitude: o.longitude,
        address: o.address,
        imgKey: o.imgKey,
      }));

      // insert
      const { data: createOptions, error: pollOpError } = await supabase
        .from("poll_option")
        .insert(rows)
        .select();

      if (pollOpError || !createOptions) {
        console.error("Error creating poll_option: ", pollOpError);
        return null;
      }

      const options: PollOption[] =
        createOptions.map((o) => ({
          option_id: o.id,
          label: o.label,
          latitude: o.latitude,
          longitude: o.longitude,
          address: o.address,
          imgKey: o.imgKey,
          url: o.url,
        })) || [];

      const detail = {
        poll_id: poll.id,
        event_id: poll.event_id,
        title: poll.title,
        is_active: poll.is_active,
        type: poll.type,
        options,
      };

      console.log(detail);

      return detail;
    } catch (err) {
      console.log("Error:", err);
      throw err;
    }
  },

  updatePollById: async (poll_id: string): Promise<void> => {
    // change is_active to be false
    try {
      const { data, error } = await supabase
        .from("poll")
        .update({
          is_active: false,
        })
        .eq("id", poll_id)
        .select()
        .single();

      console.log(data);

      if (error || !data) {
        console.error("Error updating poll", error);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
}));
