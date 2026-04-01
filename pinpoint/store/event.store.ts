import { EventDetail } from "../app/(root)/event/[id]";
import { Member } from "@/app/(root)/members/[id]";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface EventStore {
  toggleEventRender: boolean;
  setToggleEventRender: () => void;
  selectedEvent: EventDetail | null;
  setSelectedEvent: (event: EventDetail) => void;
  clearSelectedEvent: () => void;
  members: Member[]; //store member for eventForm
  setMembers: (invitedMembers: Member[]) => void;
}

export const useEventStore = create<EventStore>()(
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
    }),

    //
    {
      name: "event-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
