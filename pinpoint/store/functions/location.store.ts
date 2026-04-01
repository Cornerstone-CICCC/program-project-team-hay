import { supabase } from "../../libs/supabase/client";
import { create } from "zustand";
import { useAuthStore } from "./auth.store";

interface UserLocation {
  id: string;
  event_id: string;
  user_id: string;
  latitude: number;
  longitude: number;
}

interface MarkerData {
  latitude: number;
  longitude: number;
  id?: string; //location id
  userId: string;
  name: string;
  image: string;
  friend_id?: string;
}

type Action = {
  createMyLocationRowForEvent: (userLocation: {
    event_id: string;
    latitude?: number;
    longitude?: number;
  }) => Promise<UserLocation | boolean | null>;

  updateMyLocation: (userLocation: {
    event_id: string;
    latitude: number;
    longitude: number;
  }) => Promise<MarkerData | null>;

  getAllMembersLocation: (event_id: string) => Promise<MarkerData[] | null>;
};

export const useLocationStore = create<Action>((set, get) => ({
  createMyLocationRowForEvent: async (userLocation: {
    event_id: string;
    latitude?: number;
    longitude?: number;
  }): Promise<UserLocation | boolean | null> => {
    try {
      // //check if a location row of the user is already existed

      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error("Authentication required");

      const { data: location, error: selectLocErr } = await supabase
        .from("location")
        .insert({
          user_id: currentUser.id,
          event_id: userLocation.event_id,
          latitude: userLocation.latitude ?? 0,
          longitude: userLocation.longitude ?? 0,
        })
        .select()
        .single();

      if (selectLocErr || !location) {
        console.log("Error creating a location row: ", selectLocErr);
        return null;
      }

      const detail = {
        id: location.id,
        event_id: location.event_id,
        user_id: location.user_id,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      console.log(detail);

      return detail;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  updateMyLocation: async (userLocation: {
    event_id: string;
    latitude: number;
    longitude: number;
  }): Promise<MarkerData | null> => {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error("Authentication required");

      // update the location of the user
      const { data: location, error: updateLocErr } = await supabase
        .from("location")
        .update({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        })
        .eq("user_id", currentUser.id)
        .eq("event_id", userLocation.event_id)
        .select()
        .single();

      if (updateLocErr || !location) {
        console.log("Error updating a location row: ", updateLocErr);
        return null;
      }

      // get the profile of the user
      const { data: profile, error: selectProfileErr } = await supabase
        .from("profiles")
        .select("name, profile_image_url")
        .eq("id", location.user_id)
        .single();

      if (selectProfileErr || !profile) {
        console.log("Error selecting a profile row: ", selectProfileErr);
        return null;
      }

      const detail = {
        latitude: location.latitude,
        longitude: location.longitude,
        id: location.id,
        userId: location.user_id,
        name: profile.name,
        image: profile.profile_image_url,
      };

      console.log(detail);

      return detail;
    } catch (error) {
      console.log(error);
      throw new Error("fail update locaiton");
    }
  },

  getAllMembersLocation: async (
    event_id: string,
  ): Promise<MarkerData[] | null> => {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error("Authentication required");

      // 1. get all members' location
      const { data: locations, error: selectLocErr } = await supabase
        .from("location")
        .select("*")
        .eq("event_id", event_id);

      if (selectLocErr || !locations || locations.length === 0) {
        console.log("Error selecting locations ", selectLocErr);
        return [];
      }

      const userIds = locations.map((l) => l.user_id);

      // 2. get profile info at once
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, profile_image_url")
        .in("id", userIds);

      // 3. get friends's info at once
      const { data: friends } = await supabase
        .from("friend")
        .select("*")
        .or(`user_id.eq.${currentUser.id},friend_user_id.eq.${currentUser.id}`);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]));

      const friendMap = new Map();
      friends?.forEach((f) => {
        const otherId =
          f.user_id === currentUser.id ? f.friend_user_id : f.user_id;
        friendMap.set(otherId, f.id);
      });

      //4. Mapping
      const details: MarkerData[] = locations
        .map((loc): MarkerData | null => {
          const profile = profileMap.get(loc.user_id);
          if (!profile) return null;

          return {
            id: loc.id,
            latitude: loc.latitude,
            longitude: loc.longitude,
            userId: loc.user_id,
            name: profile.name,
            image: profile.profile_image_url,
            friend_id: friendMap.get(loc.user_id),
          };
        })
        .filter((item): item is MarkerData => item !== null);

      console.log(details);
      return details;
    } catch (error) {
      console.log(error);
      throw new Error("Fail get memebers' location");
    }
  },
}));
