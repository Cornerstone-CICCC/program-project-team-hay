import { create } from "zustand";

type CurrentRoom = {
  room_id: string
  type: "dm" | "group"
  name: string
}

type State = {
  currentRoom: CurrentRoom | null
  setCurrentRoom: (room: CurrentRoom) => void
}

export const useMyChatStore = create<State>((set) => ({
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
}))