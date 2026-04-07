import { useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useAuthStore } from "@/store/functions/auth.store";

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderImage: ImageSourcePropType;
  text: string;
  createdAt: string;
  isMine: boolean;
};

export const options = {
  headerShown: false,
};

const Chatroom = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const event_id = null;

  const router = useRouter();
  // const params = useSearchParams()

  const goToEventDetail = () => {
    router.push(`/event/${event_id}`);
  };

  // const { roomId } = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "c01",
      senderId: "c101",
      senderName: "John",
      senderImage: require("../../../assets/images/dummy02.png"),
      text: "Hello!",
      createdAt: "2026-03-06T10:49:00Z",
      isMine: false,
    },
    {
      id: "c02",
      senderId: "c102",
      senderName: "Harry",
      senderImage: require("../../../assets/images/dummy02.png"),
      text: "Hey! How are you?",
      createdAt: "2026-03-06T11:03:00Z",
      isMine: true,
    },
    {
      id: "c03",
      senderId: "c101",
      senderName: "John",
      senderImage: require("../../../assets/images/dummy02.png"),
      text: "Good. Are you free tomorrow?",
      createdAt: "2026-03-06T11:05:00Z",
      isMine: false,
    },
    {
      id: "c04",
      senderId: "c102",
      senderName: "Harry",
      senderImage: require("../../../assets/images/dummy02.png"),
      text: "Yep! What are you planning?",
      createdAt: "2026-03-06T11:08:00Z",
      isMine: true,
    },
    {
      id: "c05",
      senderId: "c101",
      senderName: "John",
      senderImage: require("../../../assets/images/dummy02.png"),
      text: "I found so nice reataurant! So if you have free time, do you want to go there?",
      createdAt: "2026-03-06T11:05:00Z",
      isMine: false,
    },
    {
      id: "c06",
      senderId: "c102",
      senderName: "Harry",
      senderImage: require("../../../assets/images/dummy02.png"),
      text: "Awesome!",
      createdAt: "2026-03-06T11:08:00Z",
      isMine: true,
    },
    {
      id: "c07",
      senderId: "c102",
      senderName: "Harry",
      senderImage: require("../../../assets/images/dummy02.png"),
      text: "Awesome!",
      createdAt: "2026-03-06T11:08:00Z",
      isMine: true,
    },
  ]);
  const [message, setMessage] = useState<string>("");
  const sendMsg = () => {
    if (!message.trim()) return;
    const currentUser = {
      id: "c102",
      name: "Harry",
      image: require("../../../assets/images/dummy02.png"),
    };
    const newMsg: Message = {
      id: `c${messages.length + 1}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderImage: currentUser.image,
      text: message,
      createdAt: new Date().toISOString(),
      isMine: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.bg} className="pt-14">
        <View style={styles.roomHead}>
          <AntDesign
            name="arrow-left"
            size={20}
            color="#fff"
            className="px-2 py-1.5"
            onPress={() => router.back()}
          />
          {/* {data.type === 'dm' ? (
            <Text style={styles.roomName}>{data.name}</Text>
          ) : (
            <TouchableOpacity onPress={goToEventDetail}>
              <Text style={styles.roomName}>{data.name}</Text>
            </TouchableOpacity>
          )} */}
          <Text style={styles.roomName}>John</Text>
        </View>

        <View style={styles.roomMain}>
          <FlatList
            inverted
            data={[...messages].reverse()}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={item.isMine ? styles.msgTo : styles.msgFrom}>
                {!item.isMine && (
                  <Image
                    source={item.senderImage}
                    style={styles.msgImg}
                    resizeMode="cover"
                  />
                )}
                <View
                  style={
                    item.isMine ? styles.msgToTxtWrap : styles.msgFromTxtWrap
                  }
                >
                  <Text
                    style={item.isMine ? styles.msgToTxt : styles.msgFromTxt}
                  >
                    {item.text}
                  </Text>
                  <Text
                    style={styles.msgTime}
                    className={item.isMine ? "text-right" : ""}
                  >
                    {item.createdAt}
                  </Text>
                </View>
              </View>
            )}
          />
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
              <Feather name="send" size={24} color="#fff" onPress={sendMsg} />
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
