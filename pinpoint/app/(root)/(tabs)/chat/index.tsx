import { useState } from "react"
import { ScrollView, StyleSheet, TextInput, View } from "react-native"
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import ChatListItem from "@/components/ChatListItem";
import { useRouter } from "expo-router";

const Chat = () => {
  const router = useRouter()
  const [keyword, setKeyword] = useState<string>('')
  const [chats, setChats] = useState<[]>([])
  const chatLists = [
    { id: 'b01', image: require('../../../../assets/images/dummy02.png'), name: 'John', latestMsg: 'Hello!', latestTime: '4:50', unread: 2 },
    { id: 'b02', image: require('../../../../assets/images/dummy02.png'), name: 'Smith', latestMsg: 'Can we have lunch today?', latestTime: '7:50', unread: 9 },
    { id: 'b03', image: require('../../../../assets/images/dummy02.png'), name: 'Harry', latestMsg: 'What do you want to eat?', latestTime: '8:19', unread: 3 },
  ]
  const filteredChats = chatLists.filter(item => 
    item.name.toLowerCase().includes(keyword.toLowerCase())
  )
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.chatHead}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color="#7C7C7C" />
          <TextInput placeholder="Search..." placeholderTextColor='#7C7C7C' value={keyword} onChangeText={setKeyword} style={styles.inputSearch} />
        </View>
        <View style={styles.chatCreate} onTouchEnd={() => router.push('/chat/create')}>
          <AntDesign name="plus" size={24} color="white" />
        </View>
      </View>
      <View style={styles.chatList}>
        {filteredChats.map((item) => (
          <ChatListItem key={item.id} data={item} />
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
    flex: 1
  },
  inputSearch: {
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
  chatList: {
    marginBottom: 30,
  },
})