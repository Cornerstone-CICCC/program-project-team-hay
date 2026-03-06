import { useRouter } from "expo-router"
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from "react-native"

type Friend = {
  id: string,
  name: string,
  image: ImageSourcePropType
}

type Props = {
  data: Friend
}

const CurrentFriendCard = ({ data }: Props) => {
  const router = useRouter()
  const goToChatRoom = () => {
    router.push(`/chat/${data.id}`)
  }

  return (
    <TouchableOpacity onPress={goToChatRoom}>
      <Image source={data.image} style={styles.friendImg} />
    </TouchableOpacity>
  )
}

export default CurrentFriendCard

const styles = StyleSheet.create({
  friendImg: {
    borderRadius: '50%',
    overflow: 'hidden',
    width: 70,
    height: 70,
    objectFit: 'cover',
  }
})