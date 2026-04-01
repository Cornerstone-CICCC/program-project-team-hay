import { Text, TouchableOpacity, View } from "react-native";
import { useChatDetailStore } from "../../store/functions/chatDetail.store";

export default function TestChatFile() {
  const { subscribeRoom, sendMessage, messages } = useChatDetailStore();

  return (
    <View
      style={{ marginTop: 50, padding: 20, backgroundColor: "#eee" }}
      className="flex gap-5"
    >
      <TouchableOpacity
        onPress={() => subscribeRoom("12", "dm")}
        style={{ width: 150, height: 80, backgroundColor: "orange" }}
      >
        <Text style={{ fontSize: 20 }}>1. Subscribe</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          sendMessage({
            room_id: "12",
            type: "dm",
            message: "This is a subscription test!",
          })
        }
        style={{ width: 150, height: 80, backgroundColor: "orange" }}
      >
        <Text>2. Send Message</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => console.log(messages)}
        style={{ width: 150, height: 80, backgroundColor: "orange" }}
      >
        <Text>3. 현재 스토어 로그 확인</Text>
      </TouchableOpacity>
    </View>
  );
}
