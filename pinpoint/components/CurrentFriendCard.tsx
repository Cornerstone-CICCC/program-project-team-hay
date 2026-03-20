import { useRouter } from "expo-router"
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from "react-native"

type Friend = {
  dm_id: string,
  friend_userId: string,
  friend_image: string | ImageSourcePropType,
  friend_name: string
}

type Props = {
  data: Friend
}

const CurrentFriendCard = ({ data }: Props) => {
  const router = useRouter()
  const goToChatRoom = () => {
    router.push(`/chat/${data.dm_id}`)
  }

  return (
    <TouchableOpacity onPress={goToChatRoom}>
      <Image source={
        typeof data.friend_image === 'string'
        ? { uri: data.friend_image }
        : data.friend_image
      } style={styles.friendImg} resizeMode="cover" />
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