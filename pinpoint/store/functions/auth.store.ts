import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from 'expo-web-browser';
import { create } from "zustand";
import { supabase } from "../../libs/supabase/client";

export interface User {
  id: string;
  name: string;
  email: string;
  public_code: string;
  login_type: string;
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
  changePassword: (
    email: string,
    oldPwd: string,
    newPwd: string,
  ) => Promise<void>;
  onGoogleSignIn:()=>Promise<void>;
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
        public_code: data.public_code || "",
        login_type: data.login_type || "email",
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

    if (error) {
      console.log(error);
      throw error;
    }

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

      set({
        user: {
          ...user,
          ...userData,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Error updating user", err);
      throw err;
    }
  },
  changePassword: async (email: string, oldPwd: string, newPwd: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: oldPwd,
      });
      if (error) throw error;

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPwd,
      });

      if (updateError) throw updateError;
    } catch (err) {
      console.error("Error changing password", err);
      throw err;
    }
  },
  onGoogleSignIn: async()=>{
        try {
          const redirectTo = makeRedirectUri()
    
          console.log('Redirect URI:', redirectTo)
    
          // 1. Ask Supabase for the Google login URL
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo,
              skipBrowserRedirect: true, // we manually open the browser below
            },
          })
    
          console.log("data",data)
    
          if (error) throw error
    
          // 2. Open Google login page in browser
          const result = await WebBrowser.openAuthSessionAsync(
            data?.url ?? '',
            redirectTo
          )
    
          // 3. After user logs in, Google redirects back to your app
          if (result.type === 'success') {
            // const url = new URL(result.url)
            // console.log("url",url)
            const params = new URLSearchParams(result.url.split('#')[1])
    
            // 4. Extract tokens from the URL
            const access_token = params.get('access_token')
            const refresh_token = params.get('refresh_token')

            // console.log("access_token",access_token)
            // console.log("refresh_token",refresh_token)
    
            if (access_token && refresh_token) {
              // 5. Set the session in Supabase
              const data = await supabase.auth.setSession({
                access_token,
                refresh_token,
              })
    
              if (data.error){
                console.log("session error")
                return
              }
    
              const {data:{user}} = await supabase.auth.getUser()
              console.log("data",data)
    
              if(!user){
                console.log("No User found in session")
                return
              }
              const userId = user.id
              const profile = await get().fetchUserProfile(userId);
              set({ user: profile });

              console.log('Signed in successfully!')
            }
          }
        } catch (error) {
          console.log('Error signing in with Google:', error)
        }
  }
}));
