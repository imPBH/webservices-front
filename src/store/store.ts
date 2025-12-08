import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Store {
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
  username: string;
  email: string;
  role: number;
  parkingApiKey: string;
  alertsApiKey: string;
  setLoggedIn: (value: boolean) => void;
  setAccessToken: (value: string) => void;
  setRefreshToken: (value: string) => void;
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
  setRole: (value: number) => void;
  setParkingApiKey: (value: string) => void;
  setAlertsApiKey: (value: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: "",
      refreshToken: "",
      username: "",
      email: "",
      role: NaN,
      parkingApiKey: import.meta.env.VITE_PARKING_API_KEY || "",
      alertsApiKey: import.meta.env.VITE_ALERTS_API_KEY || "",
      setLoggedIn: (loggedIn: boolean) => set(() => ({ isLoggedIn: loggedIn })),
      setAccessToken: (accessToken: string) =>
        set(() => ({ accessToken: accessToken })),
      setRefreshToken: (refreshToken: string) =>
        set(() => ({ refreshToken: refreshToken })),
      setUsername: (username: string) => set(() => ({ username: username })),
      setEmail: (email: string) => set(() => ({ email: email })),
      setRole: (role: number) => set(() => ({ role: role })),
      setParkingApiKey: (apiKey: string) => set(() => ({ parkingApiKey: apiKey })),
      setAlertsApiKey: (apiKey: string) => set(() => ({ alertsApiKey: apiKey })),
    }),
    {
      name: "webservice-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
