import { useState } from "react"
import { Image, ImageSourcePropType, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";

type User = {
  id: string,
  name: string,
  image: ImageSourcePropType,
  email: string,
  public_code: string,
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
  const [users, setUsers] = useState<User[]>([])
  const userLists: User[] = [
    { id: 'f01', image: require('../../../assets/images/dummy02.png'), name: 'John', email: 'test01@gmail.com', public_code: '3e4r5t' },
    { id: 'f02', image: require('../../../assets/images/dummy02.png'), name: 'Smith', email: 'test02@gmail.com', public_code: '2e4r5t' },
    { id: 'f03', image: require('../../../assets/images/dummy02.png'), name: 'Harry', email: 'test03@gmail.com', public_code: '1e4r5t' },
  ]
  const foundUser = userLists.find(item => 
    item.email === keyword || item.public_code === keyword
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
          <TextInput placeholder="Enter your friend's Email or Public Code" placeholderTextColor='#7c7c7c' value={keyword} onChangeText={setKeyword} style={styles.inputSearch} />
        </View>
        {keyword === '' ? null : foundUser ?
          <View style={styles.chatList}>
            <TouchableOpacity onPress={() => goToRoom(foundUser.id)} style={styles.chatItem}>
              <Image source={foundUser.image} style={styles.chatImg} resizeMode="cover" />
              <Text style={styles.chatName}>{foundUser.name}</Text>
            </TouchableOpacity>
          </View>
          : 
          <Text style={styles.resultTxt}>User not found.</Text>
        }
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
    flex: 1,
  },
  searchWrap: {
    backgroundColor: '#F3F3F3',
    borderRadius: 24,
    padding: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 14,
  },
  inputSearch: {
    flex: 1,
    fontFamily: 'Lexend-Regular',
  },
  chatList: {
    marginBottom: 30,
  },
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    paddingBlock: 12,
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
  resultTxt: {
    fontFamily: 'Lexend-Regular',
    marginTop: 6,
  },
})