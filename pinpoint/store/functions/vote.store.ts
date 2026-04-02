import { supabase } from "../../libs/supabase/client";
import { create } from "zustand";
import { useAuthStore } from "./auth.store";

type Result = {
  poll_option_id: string;
  label: string;
  voteCount: number; // the number of votes for the poll_option_id
};

//type State = {};

type Action = {
  createVoteForOption: (
    option_id: string,
    poll_id: string,
  ) => Promise<Result[] | null>;
};

export const useVoteStore = create<Action>((set, get) => ({
  createVoteForOption: async (
    option_id: string,
    poll_id: string,
  ): Promise<Result[] | null> => {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error("Authentication required");

      // create a vote by userId, option_id
      const { data: vote, error: createVoteErr } = await supabase
        .from("poll_vote")
        .insert({
          poll_option_id: option_id,
          poll_id: poll_id,
          user_id: currentUser.id,
        })
        .select()
        .single();

      if (createVoteErr || !vote) {
        console.error("Error creating vote: ", createVoteErr);
        return null;
      }

      const { data: options, error: selectOpsErr } = await supabase
        .from("poll_option")
        .select("id, label")
        .eq("poll_id", poll_id);

      if (selectOpsErr || !options) {
        console.error("Error selecting option ids: ", selectOpsErr);
        return null;
      }

      // get votes for each option
      const { data: voteResult, error: selectResErr } = await supabase
        .from("poll_vote")
        .select("poll_option_id")
        .eq("poll_id", poll_id);

      if (selectResErr || !voteResult) {
        console.error("Error selecting results: ", selectResErr);
        return null;
      }

      const counts = voteResult.reduce((acc: Record<string, number>, curr) => {
        const id = String(curr.poll_option_id);
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

      const result: Result[] = options.map((o) => ({
        poll_option_id: o.id,
        label: o.label,
        voteCount: counts[o.id] || 0,
      }));

      console.log(result);

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
}));
