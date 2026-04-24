import { create } from "zustand";

type CurrentRoom = {
  room_id: string
  type: "dm" | "group"
  name: string
}

type UnreadCount = Record<string, number> // { room_id: unread_count }

type State = {
  currentRoom: CurrentRoom | null
  setCurrentRoom: (room: CurrentRoom) => void

  unreadCount: UnreadCount

  setUnreadCount: (room_id: string, count: number) => void
  increaseUnread: (room_id: string) => void
  clearUnread: (room_id: string) => void
}

export const useMyChatStore = create<State>((set) => ({
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),

  unreadCount: {},

  setUnreadCount: (room_id, count) => 
    set((state) => ({
      unreadCount: {
        ...state.unreadCount,
        [room_id]: count,
      },
    })),

  increaseUnread: (room_id) => 
    set((state) => ({
      unreadCount: {
        ...state.unreadCount,
        [room_id]: (state.unreadCount[room_id] || 0) + 1,
      },
    })),

  clearUnread: (room_id) => 
    set((state) => ({
      unreadCount: {
        ...state.unreadCount,
        [room_id]: 0,
      },
    })),
}))