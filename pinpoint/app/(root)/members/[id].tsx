import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Member{
    userId:string,
    image?:string,
    name:string,
    friend_id?:string 
}
const memberList = ({event_id}:{event_id:string}) => {
    const [members, setMembers] = useState<Member[]>([])

    useEffect(()=>{
      // const memberList:Member[] = fetchMembers
        // fetch members

        // set member
        // setMembers(memberList)
    },[event_id])

    useEffect(()=>{ //to be removed
      const memberList:Member[] = [
      {
        userId: "user-1",
        name: "Emma Watson",
        image: "/avatars/emma.jpg",
        friend_id:"123"
      },
      {
        userId: "user-2",
        name: "Chris Evans",
        image: "/avatars/chris.jpg",
      },
      {
        userId: "user-3",
        name: "Tom Holland",
        image: "/avatars/tom.jpg",
      },
    ]
        setMembers(memberList)
    },[])

    // redirect to dm chat room, if dm_id not exist, then create a new dm row
    const handleRedirectToDMRoom = async(item:Member)=>{
      let friend_id;

      if(!item.friend_id){
        //create friend

        // set returning friend_id
        // friend_id=
      }else{
        friend_id= item.friend_id
      }

      router.push(`/chat/${friend_id}` as any)
    }
  return (
    <View
    style={styles.bg} className="pt-[76px]">
      <View
      style={styles.roomHead}>
        <TouchableOpacity
        onPress={()=>router.back()}>
           <AntDesign name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>

        <Text
        style={styles.roomName}>Members</Text>

        <View/>
      </View>

      <View
      style={styles.roomMain}>
        <FlatList
        style={styles.chatList}
        data={members}
        keyExtractor={(item)=>item.userId}
        renderItem={({item})=>(
          <View 
          style={styles.chatItem}>
            {/* <Image
            source={item.image}
            style={styles.chatImg}
            resizeMode='cover'/> */}
            <View
            className='flex flex-row items-center gap-6'>
              <View
              className='bg-gray-400'
              style={styles.chatImg}
              />
              <Text
              style={styles.chatName}>
                {item.name}
              </Text>
            </View>

            <TouchableOpacity
            onPress={()=>handleRedirectToDMRoom(item)}
            >
              <Text
              className='border border-[#EEEEEE] rounded-md py-1 px-3 font-Lexend'
              style={styles.btntext}
              >Message</Text>
            </TouchableOpacity>
          </View>
        )}
        />
      </View>

    </View>
  )
}

export default memberList

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
    width: '100%',
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

  chatList: {
    marginBottom: 30,
  },
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent:"space-between",
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
    borderColor: '#7C7C7C',
    padding: 10,
    width: 100,
  },
  btntext: {
    textAlign: 'center',
    color: '#7C7C7C'
  }
})