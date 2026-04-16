import { supabase } from "../../libs/supabase/client";
import { create } from "zustand";
import { useAuthStore } from "./auth.store";

type Action = {
  createDmRoom: (
    //userId: string,
    friend_userId: string,
  ) => Promise<{
    friend_id: string;
    friend_userId: string;
    friend_image: string;
    friend_name: string;
  } | null>;

  checkIfWeAreFriend: (
    friend_userId: string,
  ) => Promise<{ friend_id: string } | null>;

  searchUser: (
    keyword: string,
  ) => Promise<{
    userId: string;
    name: string;
    image: string;
    public_code: string;
    friendId: string | null
  } | null>;

  getFriendsList: () //userId: string
  => Promise<
    | {
        friend_userId: string;
        friend_name: string;
        friend_image: string;
        room_id: string;
      }[]
    | null
  >;
};

export const useFriendStore = create<Action>((set, get) => ({
  createDmRoom: async (
    friend_userId: string,
  ): Promise<{
    friend_id: string;
    friend_userId: string;
    friend_image: string;
    friend_name: string;
  } | null> => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("Authentication required");

    if (currentUser.id === friend_userId) return null;
    const user1 =
      currentUser.id < friend_userId ? currentUser.id : friend_userId;
    const user2 =
      currentUser.id < friend_userId ? friend_userId : currentUser.id;

    // check if the users are already friends
    const { data: checkFriend, error: selectFriErr } = await supabase
      .from("friend")
      .select("id")
      .eq("user_id", user1)
      .eq("friend_user_id", user2);

    if (selectFriErr) {
      console.log("Error selecting friends");
      return null;
    }

    if (checkFriend.length > 0) {
      console.log("They're already friends with each other ");
      return null;
    }

    // add friends in the friend table
    const { data: addFriend, error: createFriErr } = await supabase
      .from("friend")
      .insert({
        user_id: user1,
        friend_user_id: user2,
      })
      .select("*")
      .single();

    if (createFriErr || !addFriend) {
      console.log("Error add friends: ", createFriErr);
      return null;
    }

    // the other person's id
    const targetFriendId =
      addFriend.user_id === currentUser.id
        ? addFriend.friend_user_id
        : addFriend.user_id;

    // get friend's profile
    const { data: friendProfile, error: selectProErr } = await supabase
      .from("profiles")
      .select("profile_image_url, name")
      .eq("id", targetFriendId)
      .single();

    if (selectProErr || !friendProfile) {
      console.log("Error get friend's profile: ", selectProErr);
      return null;
    }

    const detail = {
      friend_id: addFriend.id,
      friend_userId: addFriend.friend_user_id,
      friend_image: friendProfile.profile_image_url,
      friend_name: friendProfile.name,
    };

    console.log(detail);

    return detail;
  },
  searchUser: async (
    keyword: string,
  ): Promise<{
    userId: string;
    name: string;
    image: string;
    public_code: string;
    friendId: string | null
  } | null> => {
    const myId = useAuthStore.getState().user?.id;
    if(!myId) return null

    const { data: userProfile, error: selectUserProErr } = await supabase
      .from("profiles")
      .select("id, name, public_code, profile_image_url")
      .eq("public_code", keyword)
      .neq("id", myId)
      .maybeSingle()

    if (!userProfile || selectUserProErr) {
      console.log("Error searching user", selectUserProErr);
      return null;
    }

    const user1 = myId < userProfile.id ? myId : userProfile.id;
    const user2 = myId < userProfile.id? userProfile.id : myId

    const { data: friendData, error: selectFriendIdErr } = await supabase
      .from("friend")
      .select("id")
      .eq("user_id", user1)
      .eq("friend_user_id", user2)
      .maybeSingle();

    if (selectFriendIdErr) {
      console.log("Error getting friend id", selectUserProErr);
      return null;
    }

    const details = {
      userId: userProfile.id,
      name: userProfile.name,
      image: userProfile.profile_image_url,
      public_code: userProfile.public_code,
      friendId: friendData ? friendData.id : null
    };

    console.log(details);

    if (!details) return null;

    return details;
  },

  checkIfWeAreFriend: async (
    friend_userId: string,
  ): Promise<{ friend_id: string } | null> => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("Authentication required");

    const user1 =
      currentUser.id < friend_userId ? currentUser.id : friend_userId;
    const user2 =
      currentUser.id < friend_userId ? friend_userId : currentUser.id;

    const { data, error } = await supabase
      .from("friend")
      .select("id")
      .eq("user_id", user1)
      .eq("friend_user_id", user2)
      .single();

    if (error && error.code !== "PGRST116") {
      console.log("Error checking if they're friends with each other");
      return null;
    }

    if (!data) {
      console.log("They're not friends with each other");
      return null;
    }

    console.log(data.id);
    return { friend_id: data.id };
  },

  getFriendsList: async (): Promise<
    | {
        friend_userId: string;
        friend_name: string;
        friend_image: string;
        room_id: string;
      }[]
    | null
  > => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("Authentication required");

    const { data: friends, error: selectFriendsErr } = await supabase
      .from("friend")
      .select("*")
      .or(`user_id.eq.${currentUser.id}, friend_user_id.eq.${currentUser.id}`);

    if (!friends) {
      console.log("Friends Not Found");
      return null;
    }

    if (selectFriendsErr) {
      console.log("Error selecitng friends");
      return null;
    }

    const friendIds = friends.map((f) =>
      f.user_id === currentUser.id ? f.friend_user_id : f.user_id,
    );

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, profile_image_url")
      .in("id", friendIds);

    if (!profiles) {
      console.log("Profiles Not Found");
      return null;
    }

    const details = friends
      .map((f) => {
        const friendUserId =
          f.user_id === currentUser.id ? f.friend_user_id : f.user_id;

        const profile = profiles.find((p) => p.id === friendUserId);
        if (!profile) return null;
        return {
          friend_userId: profile.id,
          friend_name: profile.name,
          friend_image: profile.profile_image_url,
          room_id: f.id,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    console.log(details);

    return details;
  },
}));
