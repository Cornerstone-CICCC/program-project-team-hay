import { usePollStore } from "../../store/functions/poll.store";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVoteStore } from "../../store/functions/vote.store";
import { useFriendStore } from "../../store/functions/friend.store";
import { router } from "expo-router";
import { useHomeStore } from "../../store/functions/home.store";
import { useEventListStore } from "../../store/functions/eventlist.store";
import { useChatStore } from "../../store/functions/chat.store";
import { useChatDetailStore } from "../../store/functions/chatDetail.store";
import { useEffect, useState } from "react";
import { useEventStore } from "../../store/functions/event.store";
import { useLocationStore } from "../../store/functions/location.store";

export default function TestFile() {

  const fetchEventById = useEventStore((s) => s.fetchEventById);
  const fetchLocationDetailByID = useEventStore(
    (s) => s.fetchLocationDetailByID,
  );
  const getMemberListByEventId = useEventStore((s) => s.getMemberListByEventId);
  const createEvent = useEventStore((s) => s.createEvent);
  const updateEventById = useEventStore((s) => s.updateEventById);

  // decline , accept
  const declineEvent = useEventStore(s => s.declineEvent)
  const acceptEvent = useEventStore(s => s.acceptEvent)

  // Poll
  const createNewPoll = usePollStore((s) => s.createNewPoll);
  const updatePollById = usePollStore((s) => s.updatePollById);

  // Vote
  const createVoteForOps = useVoteStore((s) => s.createVoteForOption);

  // Location
  const createMyLocation = useLocationStore(
    (s) => s.createMyLocationRowForEvent,
  );
  const updateMyLocation = useLocationStore((s) => s.updateMyLocation);

  const getAllMembersLocation = useLocationStore(
    (s) => s.getAllMembersLocation,
  );

  // Friend
  const createDmRoom = useFriendStore((s) => s.createDmRoom);
  const checkIfWeAreFriend = useFriendStore((s) => s.checkIfWeAreFriend);

  // Home
  const getHomeEventList = useHomeStore((s) => s.getHomeEventList);
  const getRecentFriends = useHomeStore((s) => s.getRecentFriends);

  // Event List
  const getEventList = useEventListStore((s) => s.getEventList);

  //Chat
  const getChatList = useChatStore((s) => s.getChatList);

  // Chat detail
  const getAllMessages = useChatDetailStore((s) => s.getAllMessages);

  const sendMessage = useChatDetailStore((s) => s.sendMessage);

  // Friend
  const searchUser = useFriendStore((s) => s.searchUser);
  const getFriendsList = useFriendStore((s) => s.getFriendsList);

  const declineUserEvent = async() => {
    try {
      await declineEvent("83");
    } catch (err) {
      console.log("decline event Error", err);
    }
  }

  const acceptUserEvent = async() => {
    try {
      await acceptEvent("83");
    } catch (err) {
      console.log(" accept event Error", err);
    }
  }


  // O
  const handleCreateEvent = async () => {
    try {
      await createEvent({
        name: "event_1",
        members: [
          { userId: "d1e8f352-24a6-4539-a081-8c10570978f7" },
          { userId: "a5eb7254-a330-4bd8-bd63-990320618e0b" },
          { userId: "8d3c5225-56bf-40a3-8335-4b097de6ed97" },
        ],
        date: new Date("2026-04-22T15:00:00Z"),
      });
    } catch (err) {
      console.log("create Event Error", err);
    }
  };

  // O
  const handleUpdateEventById = async () => {
    try {
      await updateEventById("109", {"date": null, "members": [
        {"image": "https://viysxiqqbfaagoqaexsm.supabase.co/storage/v1/object/public/profiles/8d3c5225-56bf-40a3-8335-4b097de6ed97/profile.jpg", "isConfirmed": true, "name": "Ayaka M", "userId": "8d3c5225-56bf-40a3-8335-4b097de6ed97"},
        {"image": null, "isConfirmed": true, "name": "minji", "userId": "d1e8f352-24a6-4539-a081-8c10570978f7"}, 
        {"image": null, "isConfirmed": false, "name": "Yuna S", "userId": "a5eb7254-a330-4bd8-bd63-990320618e0b"}], 
        });
    } catch (err) {
      console.log("Error create update event by id ", err);
    }
  };

  // o
  const handleFetchEventById = async () => {
    try {
      await fetchEventById("80");
    } catch (err) {
      console.log("create fetch event by id Error", err);
    }
  };

  // O
  const handleFetchLocationById = async () => {
    try {
      await fetchLocationDetailByID("82");
    } catch (err) {
      console.log("create fetch location by id Error", err);
    }
  };

  // O
  const handleGetMembersByEventId = async () => {
    try {
      await getMemberListByEventId("40");
    } catch (err) {
      console.log("create get memebers in the event", err);
    }
  };

  // O
  const handleCreatePoll = async () => {
    try {
      await createNewPoll(
        {
          title: "poll_test1",
          event_id: "40",
          type: "place",
        },
        [
          { label: "Main UP", longitude: 123345 },
          { label: "Granvile Up" },
          { label: "Robson Up" },
        ],
      );
    } catch (err) {
      console.log("create Poll Error", err);
    }
  };

  // O
  const handleupdatePollById = async () => {
    try {
      await updatePollById("10");
    } catch (err) {
      console.log("create update poll Error", err);
    }
  };

  // O
  const handlecreateVoteForOps = async () => {
    try {
      await createVoteForOps("29", "11");
    } catch (err) {
      console.log("create vote for options Error", err);
    }
  };

  // O
  const handleCreateMyLocation = async () => {
    try {
      await createMyLocation({
        event_id: "82",
        latitude: 49.2791998890076,
        longitude: -123.122033732453
      });
    } catch (err) {
      console.log("create my location error", err);
    }
  };

  // O
  const handleUpdateMyLocation = async () => {
    try {
      await updateMyLocation({
        // userId: "61154114-a4aa-48e2-9fd3-47a737d26e61",
        event_id: "40",
        latitude: 34923092834092,
        longitude: 239423098203944,
      });
    } catch (err) {
      console.log("create update my location Error", err);
    }
  };

  // O
  const handleGetAllMembersLocation = async () => {
    try {
      await getAllMembersLocation("82");
    } catch (err) {
      console.log(" get all member's location Error", err);
    }
  };

  // O
  const handleCreateDmRoom = async () => {
    try {
      await createDmRoom("781237cf-5ca2-44aa-9df8-ea1dc15b1377");
    } catch (err) {
      console.log("create a row for the friend table", err);
    }
  };

  // O
  const handleCheckFriend = async () => {
    try {
      await checkIfWeAreFriend("21a62bd4-c115-4d33-a6cf-0dc11de6b05a");
    } catch (err) {
      console.log("Error check if they're friends", err);
    }
  };

  // o
  const handleGetHomeEventList = async () => {
    try {
      await getHomeEventList();
    } catch (err) {
      console.log("Error get home evenet list", err);
    }
  };

  // o
  const handleGetRecentFriends = async () => {
    try {
      await getRecentFriends();
    } catch (err) {
      console.log("Error get recent friends list", err);
    }
  };

  // o
  const handleGetFriendsList = async () => {
    try {
      await getFriendsList();
    } catch (err) {
      console.log("Get friends list Error", err);
    }
  };

  // o
  const handleSearchUser = async () => {
    try {
      await searchUser("f90c8225");
    } catch (err) {
      console.log("Search User Error", err);
    }
  };

  //
  const handleSendMessage = async () => {
    try {
      await sendMessage({
        room_id: "12",
        type: "dm",
        message: "Hi I'm user_2d, test dm message 2 to 58",
      });
    } catch (err) {
      console.log("Send message Error", err);
    }
  };

  //o
  const handleGetAllMessages = async () => {
    try {
      await getAllMessages("12", "dm");
    } catch (err) {
      console.log("Get all messages Error", err);
    }
  };

  // o
  const handleGetChatList = async () => {
    try {
      await getChatList("dm");
    } catch (err) {
      console.log("get Chat list Error", err);
    }
  };

  // o
  const handleGetEventList = async () => {
    try {
      await getEventList("invited");
    } catch (err) {
      console.log("Get event list Error", err);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="px-2">
      <View className="flexd items-center">
        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleCreateEvent}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Create Event Test
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleUpdateEventById}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Update Event by event id
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleFetchEventById}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Fetch event by id
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleFetchLocationById}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Fetch location detail by id
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleGetMembersByEventId}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Get memebers in the event
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleCreatePoll}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Create New Poll
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleupdatePollById}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Create update poll
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handlecreateVoteForOps}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Create vote
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleCreateMyLocation}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Create my lcoation for event
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleUpdateMyLocation}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Update my location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleGetAllMembersLocation}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            get All Members Location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleCreateDmRoom}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Create a dm room
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleCheckFriend}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            check if theyre friends with each other
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleGetHomeEventList}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Get home event list
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleGetRecentFriends}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Get Recent Friends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleGetFriendsList}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Get friends list
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleSearchUser}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Search User
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleSendMessage}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Send Message
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={handleGetEventList}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Get event list
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={declineUserEvent}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Decline invitation
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="flex flex-row justify-center items-center gap-3 rounded-md py-2 bg-black "
          onPress={acceptUserEvent}
        >
          <Text className="font-LexendSemiBold text-lg text-white px-5">
            Accept invitation
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
