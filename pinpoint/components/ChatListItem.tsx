import { defalutImage } from "@/constants"
import { useCurrentChatStore } from "@/store/chat.store"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

type ChatType = 'dm' | 'group' | 'past'

type ChatItem = {
  room_id: string,
  type: "dm" | "group",
  image?: string,
  name: string,
  last_message?: string,
  last_message_at?: string,
  unread_count?: number,
  num_member?: number
}

type Props = {
  data: ChatItem
}

const ChatListItem = ({ data }: Props) => {
  const router = useRouter()
  const currentChat = useCurrentChatStore(s => s.setCurrentRoom)

  const goToChatRoom = () => {
    currentChat({
      room_id: data.room_id,
      type: data.type,
      name: data.name
    })
    router.push(`/chat/${data.room_id}`)
  }
  

  const [unreadCount, setUnreadCount] = useState<number>(0)
  useEffect(() => {

  }, [])

  return (
    <TouchableOpacity onPress={goToChatRoom}>
      <View style={styles.chatItem}>
        <Image
          source={data.image ? { uri: data.image } : defalutImage.user}
          style={styles.chatImg} resizeMode="cover"
        />
        <View style={styles.chatTxtWrap}>
          <View style={styles.chatTtl}>
            <Text style={styles.chatName} numberOfLines={1}>{data.name}</Text>
            {data.num_member && 
              <Text style={styles.chatNumMember}>({data.num_member})</Text>
            }
          </View>
          <Text style={styles.chatMsg} numberOfLines={2}>{data.last_message}</Text>
        </View>
        <View style={styles.chatItemSub}>
          <Text style={styles.chatTime}>{data.last_message_at}</Text>
          {!data.unread_count || data.unread_count > 0 &&
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
    flex: 1,
    maxWidth: '60%',
  },
  chatTtl: {
    flexDirection: 'row',
    gap: 5,
  },
  chatName: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  chatNumMember: {
    fontFamily: 'Lexend-Medium',
    fontSize: 16,
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