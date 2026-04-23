import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { useChatStore } from "@/store/functions/chat.store";
import { useMyChatStore } from "@/store/chat.store";
import { useEventStore } from "@/store/functions/event.store";

type ChatType = "dm" | "group" | "past";

interface ChatRoom {
  room_id: string,
  type: "dm" | "group";
  name: string,
  image?: string,
  last_message?: string,
  last_message_at?: string,
  unread_count?: number,
  num_member?: number,
}

const Chat = () => {
  const chat = useChatStore()
  const myChat = useMyChatStore()
  const eventMembers = useEventStore(s => s.getMemberListByEventId)

  const tabs: { label: string, value: ChatType }[] = [
    { label: 'DM', value: 'dm' },
    { label: 'Group', value: 'group' },
    { label: 'Past Events', value: 'past' },
  ]

  const router = useRouter()
  const [keyword, setKeyword] = useState<string>('')
  const chatList = chat.rooms
  const [activeTab, setActiveTab] = useState<ChatType>('dm')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [memberNum, setMemberNum] = useState<Record<string, number>>({})
  const [isMemberLoading, setIsMemberLoading] = useState<boolean>(true)

  const fetchChats = async (tab: ChatType) => {
    setIsLoading(true)
    await chat.getChatList(tab)
    setIsLoading(false)
  }

  const handleTabChange = (tab: ChatType) => {
    setActiveTab(tab);
    fetchChats(tab)
  };

  useEffect(() => {
    chat.subscribeChatList(activeTab)
    fetchChats(activeTab)

    return () => {
      chat.unsubscribeChatList()
    }
  }, [activeTab])

  useEffect(() => {
    const getMember = async () => {
      setIsMemberLoading(true)
      const num: Record<string, number> = {}

      await Promise.all(
        (chatList ?? []).map(async (item) => {
          if(item.type === 'group'){
            const members = await eventMembers(item.room_id)
            num[item.room_id] = members?.length ?? 0
          }
        })
      )
      setMemberNum(num)
      setIsMemberLoading(false)
    }
    if(chatList?.length){
      getMember()
    }
  }, [chatList])

  const filteredChats = (chatList ?? []).filter(item => 
    item.name.toLowerCase().includes(keyword.toLowerCase())
  )

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
        {isLoading || isMemberLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#FF7600" />
          </View>
        ) : filteredChats.length === 0 ? (
          <Text style={styles.noData}>No chat yet</Text>
        ) : (
          filteredChats.map((item) => (
            <ChatListItem
              key={item.room_id}
              data={{
                ...item,
                unread_count: myChat.unreadCount[item.room_id] || 0,
                num_member: item.type === 'group' ? memberNum[item.room_id] : undefined
              }}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  loadingBox: {
    marginTop: 30,
  },
  noData: {
    fontFamily: "Lexend-Regular",
    fontSize: 16,
    color: "#7c7c7c",
    paddingBlock: 20,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 76,
    backgroundColor: "#fff",
  },
  chatHead: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    gap: 34,
    minHeight: 40,
  },
  searchWrap: {
    backgroundColor: "#F3F3F3",
    borderRadius: 24,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: "auto",
    gap: 7,
    flex: 1,
  },
  inputSearch: {
    fontFamily: 'Lexend-Regular',
    fontSize: 16,
    width: "100%",
    paddingBlock: 12,
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
