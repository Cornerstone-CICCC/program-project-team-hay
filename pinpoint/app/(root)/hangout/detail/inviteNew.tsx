import { useMyEventStore } from "@/store/event.store";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Member } from "../../members/[id]";
import InviteFriendType from "@/components/InviteFriendType";
import { useFriendStore } from "@/store/functions/friend.store";

const InviteNew = () => {
  const router = useRouter()

  const {setMembers,members} = useMyEventStore()

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
  const [foundUser, setFoundUser] = useState<{
    userId: string;
    name: string;
    //email: string;
    image: string;
    public_code: string;
  } | null>(null)

  const searchUser = useFriendStore(s => s.searchUser)

  const handleSearchUser = async (text: string) => {
    setKeyword(text)
    if(text.trim() === ''){
      setFoundUser(null)
      return;
    }
    const newMember = await searchUser(text)
    setFoundUser(newMember)
  }

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
        <InviteFriendType />
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color="#7C7C7C" />
          <TextInput placeholder="Search friend by public code" placeholderTextColor='#7c7c7c' value={keyword} onChangeText={handleSearchUser} style={styles.inputSearch} />
        </View>
        {keyword === '' ? null : foundUser ? 
          <View style={styles.chatList}>
            <View style={styles.chatItem}>
              <Image source={foundUser.image as any} style={styles.chatImg} resizeMode="cover" />
              <Text style={styles.chatName}>{foundUser.name}</Text>
              {isInvited(foundUser.userId) ? 
                <TouchableOpacity onPress={() => toggleInvite(foundUser)} style={styles.btnInvited}>
                  <Text style={styles.txtInvited}>Remove</Text>
                </TouchableOpacity>
                : 
                <TouchableOpacity onPress={() => toggleInvite(foundUser)} style={styles.btnDefault}>
                  <Text style={styles.txtDefault}>Invite</Text>
                </TouchableOpacity>
                }
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
    paddingHorizontal: 20,
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
  resultTxt: {
    fontFamily: 'Lexend-Regular',
    marginTop: 6,
  },
})