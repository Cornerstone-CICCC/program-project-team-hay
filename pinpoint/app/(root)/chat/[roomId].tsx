import { useEffect, useState } from "react"
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { useAuthStore, User } from "@/store/functions/auth.store";
import { useMyChatStore } from "@/store/chat.store";
import { useChatDetailStore } from "@/store/functions/chatDetail.store";
import { defalutImage } from "@/constants";

type Message = {
  id: string,
  room_id: string,
  sender_id: string,
  message: string,
  created_at: string,
}

export const options = {
  headerShown: false,
};

const Chatroom = () => {
  const router = useRouter()
  const useAuth = useAuthStore(s => s.user);
  const currentChat = useMyChatStore(s => s.currentRoom)

  const room_id = currentChat?.room_id
  const type = currentChat?.type
  const name = currentChat?.name
  const chatDetail = useChatDetailStore()

  console.log(room_id, type, name)

  const { 
    messages,
    getAllMessages,
    sendMessage,
    subscribeRoom,
    unsubscribeRoom
  } = chatDetail
  
  const chatMessages = room_id ? messages[room_id] || [] : []

  useEffect(() => {
    if(!room_id || !type) return

    getAllMessages(room_id, type)
    subscribeRoom(room_id, type)

    return () => {
      unsubscribeRoom(room_id)
    }
  }, [room_id, type])

  const handleSendMsg = async () => {
    if(!message.trim() || !room_id || !type) return

    await sendMessage({
      room_id,
      type,
      message
    })

    setMessage('')
  }

  const fetchProfile = useAuthStore(s => s.fetchUserProfile);
  const [users, setUsers] = useState<Record<string, User>>({})
  useEffect(() => {
    const fetchUsers = async () => {
      const targetUserIds = [...new Set(chatMessages.map(m => m.sender_id))]
      const storeUsers: Record<string, User> = {}

      for (const id of targetUserIds) {
        if(!users[id]){
          const target = await fetchProfile(id)
          if(target) storeUsers[id] = target
        }
      }
      setUsers(prev => ({ ...prev, ...storeUsers }))
    }

    if(chatMessages.length > 0){
      fetchUsers()
    }
  }, [chatMessages])

  const getImageSource = (item: Message) => {
    const target = users[item.sender_id]

    if(target?.profileImage){
      return { uri: target.profileImage }
    }

    return defalutImage.user
  }

  const userId = useAuth?.id
  const event_id = type === 'group' ? room_id : null
  const goToEventDetail = () => {
    router.push(`/event/${event_id}`);
  };

  const [message, setMessage] = useState<string>('')

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.bg} className="pt-14">
        <View style={styles.roomHead}>
          <AntDesign name="arrow-left" size={20} color="#fff" className="px-2 py-1.5" onPress={() => router.back()} />
          {type === 'dm' ? (
            <Text style={styles.roomName}>{name}</Text>
          ) : (
            <TouchableOpacity onPress={goToEventDetail}>
              <Text style={styles.roomName}>{name}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.roomMain}>
          <FlatList inverted data={[...chatMessages].reverse()} keyboardShouldPersistTaps="handled" keyExtractor={(item) => item.id} renderItem={({item}) => {
            const isMine = item.sender_id === userId
            const msgDate = new Date(item.created_at)
            const formattedDate = `${msgDate.getFullYear()}/${String(msgDate.getMonth()+1).padStart(2,'0')}/${String(msgDate.getDate()).padStart(2,'0')}/` +
              `${String(msgDate.getHours()).padStart(2,'0')}:${String(msgDate.getMinutes()).padStart(2,'0')}`
            return (
              <View style={isMine ? styles.msgTo : styles.msgFrom}>
                {!isMine && <Image source={getImageSource(item)} style={styles.msgImg} resizeMode="cover" />}
                <View style={isMine ? styles.msgToTxtWrap : styles.msgFromTxtWrap}>
                  <Text style={isMine ? styles.msgToTxt : styles.msgFromTxt}>{item.message}</Text>
                  <Text style={styles.msgTime} className={isMine ? 'text-right' : ''}>{formattedDate}</Text>
                </View>
              </View>
            )
          }}/>
        </View>

        <View style={styles.roomBottom}>
          <View style={styles.sendWrap}>
            <TextInput
              multiline
              placeholder="Type message here..."
              placeholderTextColor="#7C7C7C"
              value={message}
              onChangeText={setMessage}
              style={styles.inputMsg}
            />
            <View style={styles.sendIcon}>
              <Feather name="send" size={24} color="#fff" onPress={handleSendMsg} />
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chatroom;

const styles = StyleSheet.create({
  bg: {
    backgroundColor: "#FF7600",
    flex: 1,
    position: "relative",
  },
  roomHead: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingBlock: 18,
    paddingHorizontal: 14,
  },
  roomName: {
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
    color: "#fff",
  },
  roomMain: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 28,
    marginBottom: 80,
    flex: 1,
  },
  msgWrap: {
    gap: 16,
  },
  msgFrom: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    maxWidth: "80%",
    marginBottom: 16,
  },
  msgImg: {
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
    overflow: "hidden",
  },
  msgFromTxtWrap: {
    maxWidth: "80%",
  },
  msgFromTxt: {
    backgroundColor: "#F3F3F3",
    fontFamily: "Lexend-Regular",
    fontSize: 16,
    color: "#333",
    padding: 14,
    borderRadius: 30,
    borderTopLeftRadius: 0,
  },
  msgTime: {
    fontFamily: "Lexend-Medium",
    fontSize: 12,
    color: "#7C7C7C",
    marginTop: 5,
  },
  msgToTxtWrap: {},
  msgTo: {
    maxWidth: "80%",
    marginLeft: "auto",
    marginBottom: 16,
  },
  msgToTxt: {
    backgroundColor: "#092568",
    fontFamily: "Lexend-Regular",
    fontSize: 16,
    color: "#fff",
    padding: 14,
    borderRadius: 30,
    borderBottomRightRadius: 0,
  },
  roomBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    padding: 20,
    zIndex: 50,
    width: "100%",
    backgroundColor: "#fff",
  },
  sendWrap: {
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingBlock: 7,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7,
    boxShadow: "0 0 14px 3px rgba(51, 51, 51, .12)",
    width: "100%",
  },
  inputMsg: {
    flex: 1,
    fontSize: 16,
  },
  sendIcon: {
    backgroundColor: "#FFA900",
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
