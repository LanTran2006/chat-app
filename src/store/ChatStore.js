import { create } from "zustand";
import { userStore } from "./userStore";
export const chatStore = create((set, get) => ({
  user: null,
  isUserBlocked: false,
  isReceiverBlocked: false,
  block: () => set({ isReceiverBlocked: !get().isReceiverBlocked }),
  getUserInfo: (payload,currentUser) => {
    let blockedUsers = payload.blockedUsers;
    set({ user: payload });
    if (blockedUsers.includes(currentUser.id)) {
      set({ isUserBlocked: true });
    }
    if (currentUser.blockedUsers.includes(payload.id)) {
      set({ isReceiverBlocked: true });
    }
  },
}));
