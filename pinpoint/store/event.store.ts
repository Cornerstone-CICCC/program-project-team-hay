import { Member } from "@/app/(root)/members/[id]";
import { Result } from "@/components/event-detail/ActivePoll";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { EventDetail } from "../app/(root)/event/[id]";


export interface EventStore {
  toggleEventRender: boolean;
  setToggleEventRender: () => void;
  selectedEvent: EventDetail | null;
  setSelectedEvent: (event: EventDetail) => void;
  clearSelectedEvent: () => void;
  members: Member[]; //store member for eventForm
  setMembers: (invitedMembers: Member[]) => void;
  showPollResult:boolean;
  setShowPollResult:(isUserVoted:boolean)=>void;
  pollResult:Result[]|null;
  setPollResult:(results:Result[])=>void
}

export const useMyEventStore = create<EventStore>()(
  persist(
    (set) => ({
      toggleEventRender: false,
      setToggleEventRender: () => {
        set((state) => ({ toggleEventRender: !state.toggleEventRender }));
      },
      selectedEvent: null,
      members: [],
      setSelectedEvent: (event: EventDetail) => {
        set({
          selectedEvent: event,
        });
      },
      clearSelectedEvent: () => {
        set({
          selectedEvent: null,
        });
      },
      setMembers: (invitedMembers: Member[]) => {
        set({
          members: invitedMembers,
        });
      },
      showPollResult:false,
      setShowPollResult:(isUserVoted:boolean)=>{
        set({
          showPollResult:isUserVoted
        })
      },
      pollResult:null,
      setPollResult:(results:Result[])=>{
        set({
          pollResult:results
        })
      }
    }),

    //
    {
      name: "event-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
