import { useEffect, useMemo, useRef, useState } from "react"
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { useAuthStore, User } from "@/store/functions/auth.store";
import { useMyChatStore } from "@/store/chat.store";
import { useChatDetailStore } from "@/store/functions/chatDetail.store";
import { defalutImage } from "@/constants";
import moment from 'moment-timezone'
import { EventDetail, useEventStore } from "@/store/functions/event.store";

type Message = {
  id: string,
  room_id: string,
  sender_id: string,
  message: string,
  created_at: string,
}

const Chatroom = () => {
  const router = useRouter()
  const chatDetail = useChatDetailStore()
  const { 
    messages,
    getAllMessages,
    sendMessage,
    subscribeRoom,
    unsubscribeRoom
  } = chatDetail

  //　for sender_id
  const useAuth = useAuthStore(s => s.user);
  const userId = useAuth?.id

  // for current Room
  const currentChat = useMyChatStore(s => s.currentRoom)
  const room_id = currentChat?.room_id
  const type = currentChat?.type
  const name = currentChat?.name
  console.log(room_id, type, name)

  // for user's timeline
  const userTz = moment.tz.guess()

  // send message
  const [message, setMessage] = useState<string>('')
  const handleSendMsg = async () => {
    if(!message.trim() || !room_id || !type) return
    if(isPast) return

    await sendMessage({
      room_id,
      type,
      message
    })
    setMessage('')

    //
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 50)
  }

  // ui state
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const clearUnread = useMyChatStore(s => s.clearUnread)

  // for fetching user info (image)
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

  // for fetching the user image/name
  const getImageSource = (item: Message) => {
    const target = users[item.sender_id]
    if(target?.profileImage){
      return { uri: target.profileImage }
    }
    return defalutImage.user
  }
  const getSenderName = (item: Message) => {
    const target = users[item.sender_id]
    return target?.name ?? ''
  }

  // for router
  const event_id = type === 'group' ? room_id : null
  const goToEventDetail = () => {
    router.push(`/event/${event_id}`);
  };

  // for judging the past
  const fetchEvent = useEventStore(s => s.fetchEventById)
  const [event, setEvent] = useState<EventDetail | null>(null)
  useEffect(() => {
    if(!room_id || type !== 'group') return
    const fetch = async () => {
      const res = await fetchEvent(room_id)
      setEvent(res)
    }
    fetch()
  }, [room_id, type])
  const isPast = 
    type === 'group'
      ? (event?.date
        ? moment().isAfter(moment(event.date).endOf('day'))
        : true)
      : false


  // add date label
  const addDateLabel = (msgs: Message[]) => {
    const result: any[] = []
    let lastDate = ''

    msgs.forEach(msg => {
      const dateLabel = moment.utc(msg.created_at).tz(userTz).format('YYYY-MM-DD')
      if(dateLabel !== lastDate){
        result.push({ type: 'separator', date: msg.created_at })
        lastDate = dateLabel
      }
      result.push({ type: 'message', ...msg })
    })
    return result
  }
  const displayMessages = useMemo(() => {
    return addDateLabel(chatMessages)
  }, [chatMessages])

  // clear unread_count
  useEffect(() => {
    if(room_id){
      clearUnread(room_id)
    }
  }, [room_id])


  // formatted message
  const normalizeMessages = (msgs: Message[]) => {
    const unique = Array.from(
      new Map(msgs.map(m => [m.id, m])).values()
    )
    return unique.sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
    )
  }

  // firstload
  const fetchAllMsg = async () => {
    if(!room_id || !type) return
    const data = await getAllMessages(room_id, type)
    if(data){
      setChatMessages(normalizeMessages(data))

      //
      // setTimeout(() => {
      //   flatListRef.current?.scrollToEnd({ animated: false })
      // }, 0)
      //
    }
    subscribeRoom(room_id, type)
  }

  // loadmore
  const loadMore = async () => {
    if(!hasMore || loadingMore) return
    if(!chatMessages.length || !room_id || !type) return

    setLoadingMore(true)

    //
    const prevHeight = contentHeightRef.current

    // const oldest = chatMessages[chatMessages.length - 1]
    const oldest = chatMessages[0]
    console.log('🔥oldest Msg', oldest)
    const older = await getAllMessages(
      room_id,
      type,
      oldest.created_at
    )
    if(!older || older.length === 0){
      setHasMore(false)
      setLoadingMore(false)
      return
    }
    // setChatMessages(prev => 
    //   normalizeMessages([...prev, ...older])
    // )

    setChatMessages(prev => {
      const updated = normalizeMessages([...prev, ...older])
    //   setTimeout(() => {
    //     if (isFirstLoadMore.current) {
    //       isFirstLoadMore.current = false
    //       return
    //     }
    //     const newHeight = contentHeightRef.current
    //     const diff = newHeight - prevHeight

    //     flatListRef.current?.scrollToOffset({
    //       offset: diff,
    //       animated: false
    //     })
    //   }, 0)
      return updated
    })
    setLoadingMore(false)
  }

  // firstload trigger
  useEffect(() => {
    if(!room_id || !type) return
    fetchAllMsg()
    return () => {
      unsubscribeRoom(room_id)
    }
  }, [room_id, type])

  // for new
  useEffect(() => {
    if(!room_id) return
    const unsub = useChatDetailStore.subscribe((state) => {
      const newMsgs = state.messages[room_id]
      if(!newMsgs) return
      // setChatMessages(prev => 
      //   normalizeMessages([...prev, ...newMsgs])
      // )
      setChatMessages(prev => {
        const updated = normalizeMessages([...prev, ...newMsgs])
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true })
        }, 50)
        return updated
      })
    })
    return () => unsub()
  }, [room_id])


  // 
  const flatListRef = useRef<FlatList>(null)
  const contentHeightRef = useRef(0)
  const isFirstLoadMore = useRef(true)
  const isInitialScrollDone = useRef(false)

  useEffect(() => {
    if (!chatMessages.length) return
    if (isInitialScrollDone.current) return

    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false })
      isInitialScrollDone.current = true
    }, 600)

    return () => clearTimeout(timer)
  }, [chatMessages])


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
          <FlatList
            data={displayMessages}
            ref={flatListRef}
            // inverted
            contentContainerStyle={{
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
            // onEndReached={() => {
            //   if(!loadingMore && hasMore) loadMore()
            // }}
            // onEndReachedThreshold={0.5}
            onScroll={({ nativeEvent }) => {
              if (nativeEvent.contentOffset.y < 30) {
                if(!loadingMore && hasMore){
                  loadMore()
                }
              }
            }}
            scrollEventThrottle={16}
            // onContentSizeChange={() => {
            //   if (!isInitialScrollDone.current) {
            //     flatListRef.current?.scrollToEnd({ animated: false })
            //     isInitialScrollDone.current = true
            //   }
            // }}
            maintainVisibleContentPosition={{
              minIndexForVisible: 1
            }}
            style={styles.msgWrap}
            keyExtractor={(item, index) => item.type === 'separator' ? `sep-${index}` : item.id }
            renderItem={({item}) => {
              if(item.type === 'separator'){
                const label = (() => {
                  const m = moment.utc(item.date).tz(userTz)
                  const now = moment().tz(userTz)
                  if(m.isSame(now, 'day')) return 'Today'
                  if(m.isSame(now.clone().subtract(1, 'day'), 'day')) return 'Yesterday'
                  return m.format('YYYY-MM-DD')
                })()

                return (
                  <View style={styles.labelWrap}>
                    <Text style={styles.labelDate}>{label}</Text>
                  </View>
                )
              }
              const isMine = item.sender_id === userId

              const msgDate = item.created_at
              const formattedDate = moment.utc(msgDate).tz(userTz).format('HH:mm')

              return (
                <View style={isMine ? styles.msgTo : styles.msgFrom}>
                  {!isMine && <Image source={getImageSource(item)} style={styles.msgImg} resizeMode="cover" />}
                  <View style={isMine ? styles.msgToTxtWrap : styles.msgFromTxtWrap}>
                    {type === 'group' && !isMine && getSenderName(item) && (<Text style={styles.msgName}>{getSenderName(item)}</Text>)}
                    <Text style={isMine ? styles.msgToTxt : styles.msgFromTxt}>{item.message}</Text>
                    <Text style={styles.msgTime} className={isMine ? 'text-right' : ''}>{formattedDate}</Text>
                  </View>
                </View>
              )
            }}
          />
        </View>

        <View style={styles.roomBottom} pointerEvents={isPast ? 'none' : 'auto'}>
          <View style={isPast ? styles.sendWrapOff : styles.sendWrap}>
            <TextInput
              multiline
              placeholder={isPast ? `You can't send messages...` : "Type message here..."}
              placeholderTextColor="#7C7C7C"
              value={message}
              onChangeText={setMessage}
              style={styles.inputMsg}
              editable={!isPast}
            />
            <TouchableOpacity style={styles.sendIcon} onPress={isPast ? undefined : handleSendMsg} disabled={isPast} >
              <Feather name="send" size={24} color="#fff" />
            </TouchableOpacity>
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
    // marginBottom: 'auto'
    // paddingBottom: 60,
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
  msgName: {
    fontFamily: "Lexend-Regular",
    fontSize: 12,
    color: '#092568',
    marginBottom: 3
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
  sendWrapOff: {
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingBlock: 7,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7,
    boxShadow: "0 0 14px 3px rgba(51, 51, 51, .3)",
    width: "100%",
    opacity: 0.4,
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
  labelWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  labelDate: {
    fontFamily: "Lexend-Regular",
    fontSize: 13,
    textAlign: 'center',
    backgroundColor: '#FFA90033', // 33 20% 4d 30%
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
    paddingInline: 20,
    paddingBlock: 2,
    borderRadius: 4,
  },
});
