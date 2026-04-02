import { defalutImage } from "@/constants"
import { useRouter } from "expo-router"
import { Image, StyleSheet, TouchableOpacity } from "react-native"

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
  const goToChatRoom = () => {
    router.push(`/chat/${data.friend_id}`)
  }

  return (
    <TouchableOpacity onPress={goToChatRoom}>
      <Image
        source={data.friend_image ? { uri: data.friend_image } : defalutImage.user}
        style={styles.friendImg} resizeMode="cover"
      />
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
  }
})