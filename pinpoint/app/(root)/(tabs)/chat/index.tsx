import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import ChatListItem from "@/components/ChatListItem";
import { useRouter } from "expo-router";
import { DummyChatList } from "@/dummy/ChatList";

type ChatFilter = 'dm' | 'group' | 'archive'

interface ChatRoom {
  room_id: string,
  type: ChatFilter,
  name: string,
  image?: string,
  last_message?: string,
  last_message_at?: string,
  unread_count: number,
  num_member: number,
}

const Chat = () => {
  //
  const USE_DUMMY = true
  const userId = 'qwe123'
  //
  const tabs: { label: string, value: ChatFilter }[] = [
    { label: 'DM', value: 'dm' },
    { label: 'Group', value: 'group' },
    { label: 'Archive', value: 'archive' },
  ]

  const router = useRouter()
  const [keyword, setKeyword] = useState<string>('')
  const [chatList, setChatList] = useState<ChatRoom[]>([])
  const [activeTab, setActiveTab] = useState<ChatFilter>('dm')

  const fetchChats = async (tab: ChatFilter) => {
    //
    let data: ChatRoom[] = []
    if(USE_DUMMY){
      data = DummyChatList.filter(item => {
        switch(tab) {
          case 'dm':
            return item.type === 'dm'
          case 'group':
            return item.type === 'group'
          case 'archive':
            return item.type === 'archive'
          default:
            return item.type === 'dm'
        }
      })
    } else {
      data = await getChatList(userId, tab)
    }
    //

    // const data = await getChatList(userId, tab)
    setChatList(data)
  }

  const handleTabChange = (tab: ChatFilter) => {
    setActiveTab(tab)
  }

  useEffect(() => {
    fetchChats(activeTab)
  }, [activeTab])

  const filteredChats = chatList.filter(item => 
    item.name.toLowerCase().includes(keyword.toLowerCase())
  )
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.chatTab}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.value
          return(
            <TouchableOpacity key={tab.value} onPress={() => handleTabChange(tab.value)} style={isActive ? styles.chatTabItemWrapCurrent : styles.chatTabItemWrap}>
              <Text style={isActive ? styles.chatTabItemCurrent : styles.chatTabItem}>{tab.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <View style={styles.chatHead}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color="#7C7C7C" />
          <TextInput placeholder="Search..." placeholderTextColor='#7C7C7C' value={keyword} onChangeText={setKeyword} style={styles.inputSearch} />
        </View>
        {activeTab === 'dm' && 
          <View style={styles.chatCreate} onTouchEnd={() => router.push('/chat/create')}>
            <AntDesign name="plus" size={24} color="white" />
          </View>
        }
      </View>
      <View style={styles.chatList}>
        {filteredChats.map((item) => (
          <ChatListItem key={item.room_id} data={item} />
        ))}
      </View>
    </ScrollView>
  )
}

export default Chat

const styles = StyleSheet.create({
  container: {
    paddingInline: 20,
    paddingTop: 80,
    backgroundColor: '#fff'
  },
  chatHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    gap: 34,
    minHeight: 40,
  },
  searchWrap: {
    backgroundColor: '#F3F3F3',
    borderRadius: 24,
    paddingInline: 12,
    paddingBlock: 9,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 'auto',
    gap: 7,
    flex: 1,
  },
  inputSearch: {
    fontFamily: 'Lexend-Regular',
    width: '100%',
  },
  chatCreate: {
    backgroundColor: '#FF7600',
    borderRadius: 20,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px #3333334c',
  },
  chatTab: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 18,
  },
  chatTabItemWrap: {
    borderRadius: 24,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#7c7c7c',
    paddingBlock: 8,
    paddingInline: 16,
  },
  chatTabItem: {
    fontFamily: 'Lexend-Medium',
    fontSize: 16,
    color: '#333'
  },
  chatTabItemWrapCurrent: {
    borderRadius: 24,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#092568',
    backgroundColor: '#092568',
    paddingBlock: 8,
    paddingInline: 16,
  },
  chatTabItemCurrent: {
    fontFamily: 'Lexend-Medium',
    fontSize: 16,
    color: '#fff'
  },
  chatList: {
    marginBottom: 30,
  },
})