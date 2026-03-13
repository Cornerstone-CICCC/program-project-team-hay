import { supabase } from "../libs/supabase/client";
import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  onboardingCompleted?: boolean;
}

type State = {
  user: User | null;
};

type Action = {
  fetchUserProfile: (userId: string) => Promise<User | null>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
};

export const useAuthStore = create<State & Action>((set, get) => ({
  user: null,
  fetchUserProfile: async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile: ", error);
        return null;
      }

      if (!data) {
        console.error("No profile data returned");
        return null;
      }

      // get the information about the user who's curretnly logged in.
      const authUser = await supabase.auth.getUser();
      if (!authUser.data.user) {
        console.error("No auth user found");
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        email: authUser.data.user.email || "",
        profileImage: data.profile_image_url,
        onboardingCompleted: data.onboarding_completed,
      };
    } catch (error) {
      console.error("Error in fetchUserProfile", error);
      return null;
    }
  },
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const profile = await get().fetchUserProfile(data.user.id);
      set({ user: profile });
    }
  },
  signUp: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      const profile = await get().fetchUserProfile(data.user.id);
      set({ user: profile });
    }
  },
  updateUser: async (userData: Partial<User>) => {
    const user = get().user;
    if (!user) return;

    try {
      const updateData: any = {};
      if (userData.name !== undefined) updateData.name = userData.name;
      if (userData.profileImage !== undefined)
        updateData.profile_image_url = userData.profileImage;
      if (userData.onboardingCompleted !== undefined)
        updateData.onboarding_completed = userData.onboardingCompleted;

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);
      if (error) throw error;
    } catch (err) {
      console.error("Error updating user", err);
      throw err;
    }

    // if (error) throw error;

    // if (data.user) {
    //   // console.log(user)
    // }
  },
}));
