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

const InviteNew = () => {
  const router = useRouter()

  const isInvited = false
  const toggleInvite = () => {
    isInvited
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
        <FlatList style={styles.chatList} data = {filteredFriends} keyboardShouldPersistTaps="handled" keyExtractor={(item) => item.id} renderItem={({item}) => 
          <View style={styles.chatItem}>
            <Image source={item.image} style={styles.chatImg} resizeMode="cover" />
            <Text style={styles.chatName}>{item.name}</Text>
            <TouchableOpacity onPress={() => toggleInvite()} style={styles.btnToggle}>
              <Text style={styles.btntext}>Invite</Text>
            </TouchableOpacity>
          </View>
        } />
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
  }
})