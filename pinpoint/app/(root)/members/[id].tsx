import { defalutImage } from '@/constants';
import { useMyEventStore } from '@/store/event.store';
import { useAuthStore } from '@/store/functions/auth.store';
import { useEventStore } from '@/store/functions/event.store';
import { useFriendStore } from '@/store/functions/friend.store';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import EvilIcons from '@expo/vector-icons/EvilIcons';

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export interface Member{
    userId:string,
    image?:string,
    name:string,
    friend_id?:string 
    isConfirmed?:boolean
}
const MemberList = () => {
    const {id} = useLocalSearchParams()
    const {user} = useAuthStore()
    const [members, setMembers] = useState<Member[]>([])
    const {getMemberListByEventId} = useEventStore()
    const {createDmRoom} = useFriendStore()
    const [isLoading, setIsLoading] = useState(true);
    const {toggleEventRender} = useMyEventStore()

    useEffect(()=>{
      if(!id) {
        setIsLoading(false)
        return
      }
        // fetch members
        const fetchMember = async()=>{
          try{
          const data =await getMemberListByEventId(id as string)

          if(!data){
            console.log("Error fetching members")
            return
          }

          setMembers(data)
        }finally{
          setIsLoading(false)
        }
      }

        fetchMember()
        
    },[id,toggleEventRender])

    // redirect to dm chat room, if dm_id not exist, then create a new dm row
    const handleRedirectToDMRoom = async(item:Member)=>{
      let friend_id;

      if(item.friend_id===user?.id){
        console.log("You cannot message yourself")
        return
      }

      if(!item.friend_id){
        //create friend
        const data = await createDmRoom(item.userId)

        if(!data){
          console.log("Error getting new dm room id")
          return
        }

        friend_id=data.friend_id
      }else{
        friend_id= item.friend_id
      }

      router.push(`/chat/${friend_id}` as any)
    }

    console.log("isLoading state:", isLoading)
    if (isLoading) {
      return (
        <SafeAreaProvider>
          <SafeAreaView style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#FF7600" />
          </SafeAreaView>
        </SafeAreaProvider>
      );
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
            <View
            className='flex flex-row items-center gap-6'>
                <Image
                className='aspect-square rounded-full'
                style={styles.chatImg}
                source={item.image ?{uri:item.image}:defalutImage.user}
                resizeMode='cover'
                />
                <View
                className='gap-3'>
                    <Text
                    style={styles.chatName}>
                      {item.name}
                    </Text>
                  <View>
                    {!item.isConfirmed
                    ?<View className='flex flex-row items-center py-1 px-2 bg-red-100 w-[125px] rounded-lg'>
                      <EvilIcons name="question" size={20} color="red" />
                      <Text
                      className='font-bold text-red-700 text-[11px]'>
                        Waiting Response
                      </Text>
                    </View>:<View className='py-1 px-2'/>}
                  </View>
                </View>
            </View>

            {item.userId!==user?.id
            &&<TouchableOpacity
            onPress={()=>handleRedirectToDMRoom(item)}
            >
              <Text
              className='border border-[#EEEEEE] rounded-md py-1 px-3 font-Lexend'
              style={styles.btntext}
              >Message</Text>
            </TouchableOpacity>}
          </View>
        )}
        />
      </View>

    </View>
  )
}

export default MemberList

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
//     overflow: 'hidden'
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
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
