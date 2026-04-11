import { useMyEventStore } from "@/store/event.store";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Member } from "../../members/[id]";
import { useFriendStore } from "@/store/functions/friend.store";
import { defalutImage } from "@/constants";

const InviteExist = () => {
  const router = useRouter()
  const goToAddFriend = () => {
    router.push('/hangout/detail/inviteNew')
  }

  const {setMembers, members} = useMyEventStore()

  const toggleInvite = (member: Member) => {
    const exists = members.some(m => m.userId === member.userId)
      if(exists){
        setMembers(members.filter(m => m.userId !== member.userId))
        return
      }else{
         setMembers([...members, member])
      }
  }

  const isInvited = (userId: string) => members.some(m => m.userId === userId)

  const [keyword, setKeyword] = useState<string>('')
  const friendStore = useFriendStore(s => s.getFriendsList)

  const [friendLists, setFriendLists] = useState<{
    friend_userId: string;
    friend_name: string;
    friend_image: string;
    room_id: string;
  }[] | null>([])

  const getFriendsList = async () => {
    const data = await friendStore()
    if(data){
      setFriendLists(data)
    }
  }
  useEffect(() => {
    getFriendsList()
  }, [])

  const formattedFriends: Member[] = (friendLists ?? []).map(item => ({
    userId: item.friend_userId,
    image: item.friend_image,
    name: item.friend_name,
    friend_id: item.room_id
  }))

  const filteredFriends = formattedFriends.filter(item => 
    item.name.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <View style={styles.bg} className="pt-[76px]">
      <View style={styles.roomHead}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={20} color="#333" className="px-2 py-1.5" />
        </TouchableOpacity>
        <Text style={styles.roomName}>Choose Friends</Text>
        <TouchableOpacity onPress={goToAddFriend}>
          <Feather name="user-plus" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.roomMain}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color="#7C7C7C" />
          <TextInput placeholder="Search friends by username" placeholderTextColor='#7c7c7c' value={keyword} onChangeText={setKeyword} style={styles.inputSearch} />
        </View>
        <FlatList style={styles.chatList} data = {filteredFriends} keyboardShouldPersistTaps="handled" keyExtractor={(item) => item.userId} renderItem={({item}) => 
          <View style={styles.chatItem}>
            <Image source={item.image ? { uri: item.image } : defalutImage.user } style={styles.chatImg} resizeMode="cover" />
            <Text style={styles.chatName}>{item.name}</Text>
            {isInvited(item.userId) ? 
              <TouchableOpacity onPress={() => toggleInvite(item)} style={styles.btnInvited}>
                <Text style={styles.txtInvited}>Remove</Text>
              </TouchableOpacity>
              : 
              <TouchableOpacity onPress={() => toggleInvite(item)} style={styles.btnDefault}>
                <Text style={styles.txtDefault}>Invite</Text>
              </TouchableOpacity>
              }
          </View>
        } />
      </View>
    </View>
  )
}

export default InviteExist

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
    paddingHorizontal: 20,
    width: '90%',
    backgroundColor: '#fff'
  },
  roomName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: '#333'
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
  btnDefault: {
    marginLeft: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#7c7c7c',
    padding: 10,
    width: 100,
  },
  btnInvited: {
    marginLeft: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#092568',
    backgroundColor: '#0925681a',
    padding: 10,
    width: 100,
  },
  txtDefault: {
    textAlign: 'center',
    color: '#7c7c7c'
  },
  txtInvited: {
    textAlign: 'center',
    color: '#092568',
  },
})