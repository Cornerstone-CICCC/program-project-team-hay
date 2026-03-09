import { useState } from "react"
import { FlatList, Image, ImageSourcePropType, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";

type Friend = {
  id: string,
  name: string,
  image: ImageSourcePropType
}

const Createroom = () => {
  const router = useRouter()
  const goToChat = () => {
    router.push('/chat')
  }
  const goToRoom = (id: string) => {
    router.push(`/chat/${id}`)
  }
  const [keyword, setKeyword] = useState<string>('')
  const [friends, setFriends] = useState<Friend[]>([])
  const friendLists: Friend[] = [
    { id: 'f01', image: require('../../../../assets/images/dummy02.png'), name: 'John' },
    { id: 'f02', image: require('../../../../assets/images/dummy02.png'), name: 'Smith' },
    { id: 'f03', image: require('../../../../assets/images/dummy02.png'), name: 'Harry' },
  ]
  const filteredFriends = friendLists.filter(item => 
    item.name.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <View style={styles.bg} className="pt-14">
      <View style={styles.roomHead}>
        <TouchableOpacity onPress={goToChat}>
          <AntDesign name="arrow-left" size={20} color="#fff" className="px-2 py-1.5" />
        </TouchableOpacity>
        <Text style={styles.roomName}>Creating new chat</Text>
      </View>
      <View style={styles.roomMain}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color="#7C7C7C" />
          <TextInput placeholder="Search..." value={keyword} onChangeText={setKeyword} style={styles.inputSearch} />
        </View>
        <FlatList style={styles.chatList} data = {filteredFriends} keyboardShouldPersistTaps="handled" keyExtractor={(item) => item.id} renderItem={({item}) => 
          <TouchableOpacity onPress={() => goToRoom(item.id)} style={styles.chatItem}>
            <Image source={item.image} style={styles.chatImg} resizeMode="cover" />
            <Text style={styles.chatName}>{item.name}</Text>
          </TouchableOpacity>
        } />
      </View>
    </View>
  )
}

export default Createroom

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#FF7600',
    flex: 1,
  },
  roomHead: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingBlock: 18,
    paddingInline: 14,
  },
  roomName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: '#fff'
  },
  roomMain: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingInline: 20,
    paddingBlock: 20,
    gap: 18,
    flex: 1
  },
  searchWrap: {
    backgroundColor: '#F3F3F3',
    borderRadius: 24,
    padding: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  inputSearch: {
    flex: 1,
  },
  chatList: {
    marginBottom: 30,
  },
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    paddingBottom: 12,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3',
    marginBottom: 12,
  },
  chatImg: {
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
    overflow: 'hidden'
  },
  chatName: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: 18,
    marginBottom: 4
  },
})