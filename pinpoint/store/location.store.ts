import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  setUserLocation: ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => void;
}

export const useMyLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      userLongitude: null,
      userLatitude: null,
      setUserLocation: ({
        latitude,
        longitude,
      }: {
        latitude: number;
        longitude: number;
      }) => {
        set({
          userLatitude: latitude,
          userLongitude: longitude,
        });
      },
    }),
    {
      name: "userLocation-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
