import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Store {
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
  userId: number;
  username: string;
  email: string;
  role: number;
  setLoggedIn: (value: boolean) => void;
  setAccessToken: (value: string) => void;
  setRefreshToken: (value: string) => void;
  setUserId: (value: number) => void;
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
  setRole: (value: number) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: "",
      refreshToken: "",
      userId: NaN,
      username: "",
      email: "",
      role: NaN,
      setLoggedIn: (loggedIn: boolean) => set(() => ({ isLoggedIn: loggedIn })),
      setAccessToken: (accessToken: string) =>
        set(() => ({ accessToken: accessToken })),
      setRefreshToken: (refreshToken: string) =>
        set(() => ({ refreshToken: refreshToken })),
      setUserId: (userId: number) => set(() => ({ userId: userId })),
      setUsername: (username: string) => set(() => ({ username: username })),
      setEmail: (email: string) => set(() => ({ email: email })),
      setRole: (role: number) => set(() => ({ role: role })),
    }),
    {
      name: "webservice-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
