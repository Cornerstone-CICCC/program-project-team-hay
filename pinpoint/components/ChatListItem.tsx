import { useRouter } from "expo-router"
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native"

type ChatItem = {
  id: string,
  image: ImageSourcePropType,
  name: string,
  latestMsg: string,
  latestTime: string,
  unread: number
}

type Props = {
  data: ChatItem
}

const ChatListItem = ({ data }: Props) => {
  const router = useRouter()
  const goToChatRoom = () => {
    router.push(`/chat/${data.id}`)
  }
  return (
    <TouchableOpacity onPress={goToChatRoom}>
      <View style={styles.chatItem}>
        <Image source={data.image} style={styles.chatImg} resizeMode="cover" />
        <View>
          <Text style={styles.chatName}>{data.name}</Text>
          <Text style={styles.chatMsg}>{data.latestMsg}</Text>
        </View>
        <View style={styles.chatItemSub}>
          <Text style={styles.chatTime}>{data.latestTime}</Text>
          <View style={styles.chatUnreadWrap}>
            <Text style={styles.chatUnread}>{data.unread}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ChatListItem

const styles = StyleSheet.create({
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingBlock: 12,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3',
  },
  chatImg: {
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
    overflow: 'hidden'
  },
  chatName: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: 16,
    marginBottom: 4
  },
  chatMsg: {
    fontFamily: 'Lexend-Regular',
    fontSize: 14,
    color: '#7C7C7C'
  },
  chatItemSub: {
    marginLeft: 'auto',
    alignItems: 'center'
  },
  chatTime: {
    fontSize: 11,
    color: '#7C7C7C',
    marginBottom: 6
  },
  chatUnreadWrap: {
    backgroundColor: '#FFA900',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 12,
    width: 24,
    height: 24,
  },
  chatUnread: {
    fontFamily: 'Lexend-Medium',
    fontSize: 12,
    color: '#fff'
  }
})