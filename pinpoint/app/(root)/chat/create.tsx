import { useState } from "react"
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { useFriendStore } from "@/store/functions/friend.store";
import { defalutImage } from "@/constants";


const Createroom = () => {
  const friend = useFriendStore()
  const router = useRouter()

  const goToChat = () => {
    router.push('/chat')
  }

  const [keyword, setKeyword] = useState<string>('')
  const [foundUser, setFoundUser] = useState<{
    userId: string;
    name: string;
    //email: string;
    image: string;
    public_code: string;
  } | null>(null)

  const handleSearchUser = async (text: string) => {
    setKeyword(text)
    if(text.trim() === ''){
      setFoundUser(null)
      return;
    }
    const newFriend = await friend.searchUser(text)
    setFoundUser(newFriend)
  }

  const createChat = async (friend_userId: string) => {
    await friend.createDmRoom(friend_userId)
    router.push(`/chat/${friend_userId}`)
  }

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
          <TextInput placeholder="Enter your friend's Public Code" placeholderTextColor='#7c7c7c' value={keyword} onChangeText={handleSearchUser} style={styles.inputSearch} />
        </View>
        {keyword === '' ? null : foundUser ?
          <View style={styles.chatList}>
            <TouchableOpacity onPress={() => createChat(foundUser.userId)} style={styles.chatItem}>
              <Image source={foundUser.image ? { uri: foundUser.image } : defalutImage.user } style={styles.chatImg} resizeMode="cover" />
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
    paddingHorizontal: 14,
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
    paddingHorizontal: 20,
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