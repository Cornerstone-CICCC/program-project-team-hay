import { create } from "zustand";
import { supabase } from "../../libs/supabase/client";
import { useAuthStore } from "./auth.store";
import { useFriendStore } from "./friend.store";
export interface User {
  id: string;
  name: string;
  email: string;
  public_code: string;
  login_type: string;
  profileImage?: string;
  onboardingCompleted?: boolean;
}

export interface EventDetail {
  id: string;
  name: string;
  date: string;
  place: {
    place_name: string;
    address: string;
    latitude: number;
    longitude: number;
    url?: string;
    imgKey?: string;
  };
  members: {
    id: string;
    name: string;
    image: string;
  }[];
  activePoll?: ActivePoll[];
}

interface ActivePoll {
  id: string;
  title: string;
  is_active: boolean;
  type: "date" | "place";
  options: PollOption[];
}

interface PollOption {
  option_id: string;
  label: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  url?: string;
  imgKey?: string;
  votes?: Vote[];
}

interface Vote {
  id: string;
  option_id: string;
  userId: string;
}

interface TrackEventDetail {
  id: string; //event id
  name: string;
  date: string;
  place: {
    place_name: string;
    address: string;
    latitude: number;
    longitude: number;
    url?: string;
    imgKey?: string;
  };
}

interface Member {
  userId: string;
  image: string;
  name: string;
  friend_id?: string;
}

type Action = {
  fetchEventById: (event_id: string) => Promise<EventDetail | null>;
  fetchLocationDetailByID: (
    event_id: string,
  ) => Promise<TrackEventDetail | null>;
  getMemberListByEventId: (event_id: string) => Promise<Member[] | null>;
  createEvent: (newEvent: {
    name: string;
    date?: Date;
    place_name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    url?: string;
    imgKey?: string;
    members: {
      userId: string;
    }[];
  }) => Promise<Omit<EventDetail, "activePoll"> | null>;
  updateEventById: (
    eventId: string,
    updates: {
      name?: string;
      date?: Date;
      place_name?: string;
      address?: string;
      latitude?: number;
      longitude?: number;
      url?: string;
      imgKey?: string;
      members: {
        userId: string;
      }[];
    },
  ) => Promise<Omit<EventDetail, "activePoll"> | null>;
};

export const useEventStore = create<Action>((set, get) => ({
  fetchEventById: async (event_id: string): Promise<EventDetail | null> => {
    const { data: event, error } = await supabase
      .from("event")
      .select("*")
      .eq("id", event_id)
      .single();

    if (error || !event) {
      console.error("Error selecting event: ", error);
      return null;
    }

    const { data: userId, error: selectUsersErr } = await supabase
      .from("user_event")
      .select("user_id")
      .eq("event_id", event.id);

    if (selectUsersErr || !userId) {
      console.error("Error selecting users from user)event table: ", selectUsersErr);
      return null;
    }

    const userIds = userId.map((u) => u.user_id);

    // get members
    const { data: users, error: selectMemsError } = await supabase
      .from("profiles")
      .select("id, name, profile_image_url")
      .in("id", userIds);

    if (selectMemsError || !users) {
      console.error(
        "Error select members from profiles table: ",
        selectMemsError,
      );
      return null;
    }

    const members =
      users.map((u) => ({
        id: u.id,
        name: u.name,
        image: u.profile_image_url,
        // isConfirmed
      })) || [];

    // get active polls
    const { data: activePolls, error: selectPollsErr } = await supabase
      .from("poll")
      .select("*")
      .eq("event_id", event.id)
      .eq("is_active", true);

    if (selectPollsErr || !activePolls) {
      console.error("Error selecting active polls: ", selectPollsErr);
      return null;
    }

    const pollIds = activePolls.map((p) => p.id);

    // get poll options by poll ids
    const { data: pollOptions, error: selectOpsErr } = await supabase
      .from("poll_option")
      .select("*")
      .in("poll_id", pollIds);

    if (selectOpsErr || !pollOptions) {
      console.error("Error selecting poll options: ", selectOpsErr);
      return null;
    }

    const optionIds = pollOptions.map((po) => po.id);

    // get votes for each option
    const { data: pollVotes, error: selectVoteErr } = await supabase
      .from("poll_vote")
      .select("*")
      .in("poll_option_id", optionIds);

    if (selectVoteErr || !pollVotes) {
      console.error("Error selecting poll votes: ", selectVoteErr);
      return null;
    }

    const optionsByPollId = activePolls.map((ap) => {
      const filteredOptions = pollOptions
        .filter((po) => po.poll_id === ap.id)
        .map((po) => {
          const optionVotes = pollVotes
            .filter((v) => v.poll_option_id === po.id)
            .map((pv) => ({
              id: pv.id,
              option_id: pv.poll_option_id,
              userId: pv.user_id,
            }));

          return {
            option_id: po.id,
            label: po.label,
            latitude: po.latitude,
            longitude: po.longitude,
            address: po.address,
            url: po.url,
            imgKey: po.imgKey,
            votes: optionVotes,
          };
        });

      return {
        id: ap.id,
        title: ap.title,
        is_active: ap.is_active,
        type: ap.type,
        options: filteredOptions,
      };
    });

    const detail = {
      id: event.id,
      name: event.name,
      date: event.date,
      place: {
        imgKey: event.imgKey,
        place_name: event.place_name,
        address: event.address,
        longitude: event.longitude,
        latitude: event.latitude,
        url: event.url,
      },
      members,
      activePoll: optionsByPollId,
    };

    console.log(detail);
    return detail;
  },
  fetchLocationDetailByID: async (
    event_id: string,
  ): Promise<TrackEventDetail | null> => {
    const { data: location, error } = await supabase
      .from("event")
      .select("*")
      .eq("id", event_id)
      .single();

    if (error || !location) {
      console.error("Error selecting location detail: ", error);
      return null;
    }

    const detail = {
      id: location.id,
      name: location.name,
      date: location.date,
      place: {
        place_name: location.place_name,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        url: location.url,
        imgKey: location.imgKey,
      },
    };
    console.log(detail);
    return detail;
  },
  getMemberListByEventId: async (
    event_id: string,
  ): Promise<Member[] | null> => {
    const { data: users, error: selectUsersErr } = await supabase
      .from("user_event")
      .select("user_id")
      .eq("event_id", event_id);

    if (!users || selectUsersErr) {
      console.log("Error selecting users by eventId: ", selectUsersErr);
      return null;
    }

    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("Authentication required");

    const userIds = users.map((u) => u.user_id);
    const { data: userProfiles, error: selectUserProErr } = await supabase
      .from("profiles")
      .select("id, name, profile_image_url")
      .in("id", userIds);

    if (selectUserProErr || !userProfiles) {
      console.log(
        "Error selecting users' profiles by userIds: ",
        selectUserProErr,
      );
      return null;
    }

    const details = await Promise.all(
      userProfiles.map(async (u) => {
        const result = await useFriendStore.getState().checkIfWeAreFriend(u.id);

        return {
          userId: u.id,
          image: u.profile_image_url,
          name: u.name,
          friend_id: result?.friend_id ?? undefined,
        };
      }),
    );

    console.log(details);

    return details;
  },
  createEvent: async (newEvent: {
    name: string;
    date?: Date;
    place_name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    url?: string;
    imgKey?: string;
    members: {
      userId: string;
    }[];
  }): Promise<Omit<EventDetail, "activePoll"> | null> => {
    try {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) throw new Error("Authentication required");

      // create a row for event table
      const { data: event, error } = await supabase
        .from("event")
        .insert([
          {
            name: newEvent.name,
            date: newEvent.date?.toISOString(),
            imgKey: newEvent.imgKey,
            place_name: newEvent.place_name,
            address: newEvent.address,
            longitude: newEvent.longitude,
            latitude: newEvent.latitude,
            url: newEvent.url,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating event: ", error);
        return null;
      }

      // chekc if the members are unique (myself + member param)
      const uniqueMemberIds = new Set(newEvent.members.map((m) => m.userId));
      uniqueMemberIds.add(currentUser.id);

      // create user_event rows
      const rows = Array.from(uniqueMemberIds).map((uid) => ({
        user_id: uid,
        event_id: event.id,
      }));

      // insert
      const { error: userEventError } = await supabase
        .from("user_event")
        .insert(rows);
      //.select();

      if (userEventError) {
        console.error("Error creating user_event: ", userEventError);
        return null;
      }

      // return user_ids that is added to user_event table
      const userIds = rows.map((u) => u.user_id) || [];

      // get members
      const { data: users, error: selectMemsError } = await supabase
        .from("profiles")
        .select("id, name, profile_image_url")
        .in("id", userIds);

      if (selectMemsError || !users) {
        console.log("Error select members: ", selectMemsError);
        return null;
      }

      const members =
        users.map((u) => ({
          id: u.id,
          name: u.name,
          image: u.profile_image_url,
        })) || [];

      const detail = {
        id: event.id,
        name: event.name,
        date: event.date,
        place: {
          imgKey: event.imgKey,
          place_name: event.place_name,
          address: event.address,
          longitude: event.longitude,
          latitude: event.latitude,
          url: event.url,
        },
        members,
      };

      console.log(detail);
      return detail;
    } catch (error) {
      console.log("Error in createEvent", error);
      return null;
    }
  },

  updateEventById: async (
    eventId: string,
    updates: {
      name?: string;
      date?: Date;
      place_name?: string;
      address?: string;
      latitude?: number;
      longitude?: number;
      url?: string;
      imgKey?: string;
      members: {
        userId: string;
      }[];
    },
  ): Promise<Omit<EventDetail, "activePoll"> | null> => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("Authentication required");
    const updatePayload: any = {};

    if (updates.name !== undefined) updatePayload.name = updates.name;
    if (updates.date !== undefined)
      updatePayload.date = updates.date.toISOString();
    if (updates.place_name !== undefined)
      updatePayload.place_name = updates.place_name;
    if (updates.address !== undefined) updatePayload.address = updates.address;
    if (updates.latitude !== undefined)
      updatePayload.latitude = updates.latitude;
    if (updates.longitude !== undefined)
      updatePayload.longitude = updates.longitude;
    if (updates.url !== undefined) updatePayload.url = updates.url;
    if (updates.imgKey !== undefined) updatePayload.imgKey = updates.imgKey;

    let event;

    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await supabase
        .from("event")
        .update(updatePayload)
        .eq("id", eventId)
        .select("*");

      if (error) {
        console.log("update Error", error);
        return null;
      }

      if (!data || data.length === 0) {
        console.error("RLS error");
        const { data: refetch } = await supabase
          .from("event")
          .select("*")
          .eq("id", eventId)
          .single();
        event = refetch;
      } else {
        event = data[0];
      }
    } else {
      const { data, error: selectEventErr } = await supabase
        .from("event")
        .select("*")
        .eq("id", eventId)
        .single();

      if (selectEventErr || !data) {
        console.log("Error update event: ", selectEventErr);
        return null;
      }
      event = data;
    }

    const { error: delEventUserErr } = await supabase
      .from("user_event")
      .delete()
      .eq("event_id", eventId);

    if (delEventUserErr) {
      console.log("Error update event: ", delEventUserErr);
      return null;
    }

    const uniqueMemberIds = new Set(updates.members.map((m) => m.userId));
    uniqueMemberIds.add(currentUser.id);

    const rows = Array.from(uniqueMemberIds).map((uid) => ({
      user_id: uid,
      event_id: eventId,
    }));

    const { error: insertRowErr } = await supabase
      .from("user_event")
      .insert(rows);

    if (insertRowErr) {
      console.log(
        "Error replace(insert) users in the user_event table: ",
        insertRowErr,
      );
      return null;
    }

    // return user_ids that is added to user_event table
    const userIds = rows.map((u) => u.user_id);

    // get members
    const { data: users, error: selectMemsError } = await supabase
      .from("profiles")
      .select("id, name, profile_image_url")
      .in("id", userIds);

    if (selectMemsError || !users) {
      console.log("Error select members: ", selectMemsError);
      return null;
    }

    const members =
      users.map((u) => ({
        id: u.id,
        name: u.name,
        image: u.profile_image_url,
      })) || [];

    const detail = {
      id: eventId,
      name: event.name,
      date: event.date,
      place: {
        imgKey: event.imgKey,
        place_name: event.place_name,
        address: event.address,
        longitude: event.longitude,
        latitude: event.latitude,
        url: event.url,
      },
      members,
    };

    console.log(detail);

    return detail;
  },
}));
