import { useRouter } from "expo-router"
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native"

type ChatFilter = 'dm' | 'group' | 'archive'

type ChatItem = {
  room_id: string,
  type: ChatFilter,
  image: string | ImageSourcePropType,
  name: string,
  last_message?: string,
  last_message_at?: string,
  unread_count: number,
  num_member: number
}

type Props = {
  data: ChatItem
}

const ChatListItem = ({ data }: Props) => {
  const router = useRouter()
  const goToChatRoom = () => {
    router.push(`/chat/${data.room_id}`)
  }
  return (
    <TouchableOpacity onPress={goToChatRoom}>
      <View style={styles.chatItem}>
        <Image source={
          typeof data.image === 'string'
          ? { uri: data.image }
          : data.image
        } style={styles.chatImg} resizeMode="cover" />
        <View style={styles.chatTxtWrap}>
          <Text style={styles.chatName} numberOfLines={1}>{data.name}
            {data.num_member && 
              <Text style={styles.chatNumMember}>({data.num_member})</Text>
            }
          </Text>
          <Text style={styles.chatMsg} numberOfLines={2}>{data.last_message}</Text>
        </View>
        <View style={styles.chatItemSub}>
          <Text style={styles.chatTime}>{data.last_message_at}</Text>
          {data.unread_count > 0 &&
            <View style={styles.chatUnreadWrap}>
              <Text style={styles.chatUnread}>{data.unread_count}</Text>
            </View>
          }
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
    width: 58,
    minWidth: 58,
    height: 58,
    borderRadius: 58 / 2,
    overflow: 'hidden'
  },
  chatTxtWrap: {
    flex: 1
  },
  chatName: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  chatNumMember: {
    fontFamily: 'Lexend-Medium',
    fontSize: 16,
    marginLeft: 6,
  },
  chatMsg: {
    fontFamily: 'Lexend-Regular',
    fontSize: 13,
    color: '#7C7C7C'
  },
  chatItemSub: {
    marginLeft: 'auto',
    alignItems: 'center',
    minWidth: 28,
    alignSelf: 'flex-start',
    paddingTop: 6,
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