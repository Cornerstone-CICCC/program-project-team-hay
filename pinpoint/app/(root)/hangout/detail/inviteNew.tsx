import { useState } from "react"
import { FlatList, Image, ImageSourcePropType, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
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

const InviteNew = () => {
  const router = useRouter()

  const isInvited = false
  const toggleInvite = () => {
    isInvited
  }

  const [keyword, setKeyword] = useState<string>('')
  const [users, setUsers] = useState<User[]>([])
  const userLists: User[] = [
    { id: 'f01', image: require('../../../../assets/images/dummy02.png'), name: 'John', email: 'test01@gmail.com', public_code: '3e4r5t' },
    { id: 'f02', image: require('../../../../assets/images/dummy02.png'), name: 'Smith', email: 'test02@gmail.com', public_code: '2e4r5t' },
    { id: 'f03', image: require('../../../../assets/images/dummy02.png'), name: 'Harry', email: 'test03@gmail.com', public_code: '1e4r5t' },
  ]
  const foundUser = userLists.find(item => 
    item.email === keyword || item.public_code === keyword
  )

  return (
    <View style={styles.bg} className="pt-[76px]">
      <View style={styles.roomHead}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={20} color="#333" className="px-2 py-1.5" />
        </TouchableOpacity>
        <Text style={styles.roomName}>Invite New Friends</Text>
        <View style={styles.roomIcon}></View>
      </View>
      <View style={styles.roomMain}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color="#7C7C7C" />
          <TextInput placeholder="Search friend by email or public code" placeholderTextColor='#7c7c7c' value={keyword} onChangeText={setKeyword} style={styles.inputSearch} />
        </View>
        {keyword === '' ? null : foundUser ? 
          <View style={styles.chatList}>
            <View style={styles.chatItem}>
              <Image source={foundUser.image} style={styles.chatImg} resizeMode="cover" />
              <Text style={styles.chatName}>{foundUser.name}</Text>
              <TouchableOpacity onPress={() => toggleInvite()} style={styles.btnToggle}>
                <Text style={styles.btntext}>Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
          : 
          <Text style={styles.resultTxt}>User not found.</Text>
        }
      </View>
    </View>
  )
}

export default InviteNew

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#F8F8F8',
    flex: 1,
  },
  roomHead: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBlock: 18,
    paddingInline: 20,
    width: '90%',
    backgroundColor: '#fff'
  },
  roomName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: '#333',
    alignSelf: 'center',
  },
  roomIcon: {
    width: 24,
  },
  roomMain: {
    backgroundColor: '#F8F8F8',
    padding: 20,
    gap: 18,
    flex: 1
  },
  searchWrap: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
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
    paddingBlock: 7,
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
  },
  btnToggle: {
    marginLeft: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#7c7c7c',
    padding: 10,
    width: 100,
  },
  btntext: {
    textAlign: 'center',
    color: '#7c7c7c'
  },
  resultTxt: {
    fontFamily: 'Lexend-Regular',
    marginTop: 6,
  },
})