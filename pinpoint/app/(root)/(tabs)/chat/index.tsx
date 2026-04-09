import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import ChatListItem from "@/components/ChatListItem";
import { useRouter } from "expo-router";
import { DummyChatList } from "@/dummy/ChatList";
import { useAuthStore } from "@/store/functions/auth.store";

type ChatType = "dm" | "group" | "past";

interface ChatRoom {
  room_id: string;
  type: string;
  name: string;
  image?: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  num_member?: number;
}

const Chat = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  //
  const USE_DUMMY = true;
  //
  const tabs: { label: string; value: ChatType }[] = [
    { label: "DM", value: "dm" },
    { label: "Group", value: "group" },
    { label: "Past", value: "past" },
  ];

  const router = useRouter();
  const [keyword, setKeyword] = useState<string>("");
  const [chatList, setChatList] = useState<ChatRoom[]>([]);
  const [activeTab, setActiveTab] = useState<ChatType>("dm");

  const fetchChats = async (tab: ChatType) => {
    //
    let data: ChatRoom[] = [];
    if (USE_DUMMY) {
      data = DummyChatList.filter((item) => {
        switch (tab) {
          case "dm":
            return item.type === "dm";
          case "group":
            return item.type === "group";
          case "past":
            return item.type === "past";
          default:
            return item.type === "dm";
        }
      });
    } else {
      data = await getChatList(userId, tab);
    }
    //

    // const data = await getChatList(userId, tab)
    setChatList(
      data.map((chat) => ({
        ...chat,
        unread_count: 0,
      })),
    );
  };

  const handleTabChange = (tab: ChatType) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    fetchChats(activeTab);
  }, [activeTab]);

  const filteredChats = chatList.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chatTab}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => handleTabChange(tab.value)}
              style={
                isActive
                  ? styles.chatTabItemWrapCurrent
                  : styles.chatTabItemWrap
              }
            >
              <Text
                style={
                  isActive ? styles.chatTabItemCurrent : styles.chatTabItem
                }
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.chatHead}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color="#7C7C7C" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#7C7C7C"
            value={keyword}
            onChangeText={setKeyword}
            style={styles.inputSearch}
          />
        </View>
        {activeTab === "dm" && (
          <View
            style={styles.chatCreate}
            onTouchEnd={() => router.push("/chat/create")}
          >
            <AntDesign name="plus" size={24} color="white" />
          </View>
        )}
      </View>
      <View style={styles.chatList}>
        {filteredChats.map((item) => (
          <ChatListItem key={item.room_id} data={item} />
        ))}
      </View>
    </ScrollView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 76,
    backgroundColor: "#fff",
  },
  chatHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
    gap: 34,
    minHeight: 40,
  },
  searchWrap: {
    backgroundColor: "#F3F3F3",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingBlock: 9,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
    gap: 7,
    flex: 1,
  },
  inputSearch: {
    fontFamily: "Lexend-Regular",
    width: "100%",
  },
  chatCreate: {
    backgroundColor: "#FF7600",
    borderRadius: 20,
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px #3333334c",
  },
  chatTab: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 18,
  },
  chatTabItemWrap: {
    borderRadius: 24,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#7c7c7c",
    paddingBlock: 8,
    paddingHorizontal: 16,
  },
  chatTabItem: {
    fontFamily: "Lexend-Medium",
    fontSize: 16,
    color: "#333",
  },
  chatTabItemWrapCurrent: {
    borderRadius: 24,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#092568",
    backgroundColor: "#092568",
    paddingBlock: 8,
    paddingHorizontal: 16,
  },
  chatTabItemCurrent: {
    fontFamily: "Lexend-Medium",
    fontSize: 16,
    color: "#fff",
  },
  chatList: {
    marginBottom: 30,
  },
});
