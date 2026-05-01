import { defalutImage } from "@/constants"
import { useMyChatStore } from "@/store/chat.store"
import { useRouter } from "expo-router"
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native"

type Friend = {
  friend_id: string,
  friend_userId: string,
  friend_image: string,
  friend_name: string
}

type Props = {
  data: Friend
}

const CurrentFriendCard = ({ data }: Props) => {
  const router = useRouter()
  const currentChat = useMyChatStore(s => s.setCurrentRoom)

  console.log(`chatroom_id ${data.friend_id}`)

  const goToDmRoom = () => {
    currentChat({
      room_id: data.friend_id,
      type: 'dm',
      name: data.friend_name
    })
    router.push(`/chat/${data.friend_id}`)
  }

  return (
    <TouchableOpacity onPress={goToDmRoom}>
      <Image
        source={data.friend_image ? { uri: data.friend_image } : defalutImage.user}
        style={styles.friendImg} resizeMode="cover"
      />
      <Text style={styles.friendName}>{data.friend_name}</Text>
    </TouchableOpacity>
  )
}

export default CurrentFriendCard

const styles = StyleSheet.create({
  friendImg: {
    borderRadius: 35,
    overflow: 'hidden',
    width: 70,
    height: 70,
  },
  friendName: {
    textAlign: 'center',
    marginTop: 3,
    fontFamily: "Lexend-Regular",
    fontSize: 14,
    color: '#333'
  }
})