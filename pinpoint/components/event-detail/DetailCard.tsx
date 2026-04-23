import { EventDetail } from '@/app/(root)/event/[id]';
import { Member } from '@/app/(root)/members/[id]';
import { defalutImage } from '@/constants';
import { useMyChatStore } from '@/store/chat.store';
import { useMyEventStore } from '@/store/event.store';
import { useAuthStore } from '@/store/functions/auth.store';
import { useEventStore } from '@/store/functions/event.store';
import { useFriendStore } from '@/store/functions/friend.store';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const DetailCard = ({event}:{event:EventDetail}) => {
  const [isConfirmed, setIsComfirmed] = useState<boolean>(false)
    const {user} = useAuthStore()
    const {createDmRoom,checkIfWeAreFriend} = useFriendStore()
    const {acceptEvent,declineEvent} = useEventStore()
    const {setSelectedEvent} = useMyEventStore()
    let dateTime
    let day
    let month 
    let year 
    let wod 
    let hour 
    let mins


    if(event.date){
        dateTime = new Date(event.date)
        day = dateTime.getDate()
        month = dateTime.toLocaleString("en-CA", { month: "long" })
        year = dateTime.getFullYear()
        wod = new Intl.DateTimeFormat("en-CA", { weekday: "long"}).format(dateTime)
        hour = dateTime.getHours()
        mins = dateTime.getMinutes()
    }
    
    // set initial confirm state
    useEffect(()=>{
      const members = event.members
      const me = members.find(m=>m.userId===user?.id)
      console.log("me",me)
      const isConfirm = me?.isConfirmed ?? false
      console.log("isConfirmed", isConfirm)
      setIsComfirmed(isConfirm)
    },[event, user])


    const currentChat = useMyChatStore(s => s.setCurrentRoom)

    const handleDirectDmRoom = async(item:Member)=>{
      let friend_id;

      if(item.friend_id===user?.id){
        console.log("You cannot message yourself")
        return
      }

      if(!item.friend_id){
        const friendRow = await checkIfWeAreFriend(item.userId)
        if(!friendRow){
          //create friend
          const data = await createDmRoom(item.userId)

          if(!data){
            console.log("Error getting new dm room id")
            return
          }
          friend_id = data.friend_id;
        }else{
          friend_id=friendRow.friend_id
        }
    } else {
      friend_id = item.friend_id;
    }
      currentChat({
        room_id: friend_id,
        type: 'dm',
        name: item.name
      })
      router.push(`/chat/${friend_id}` as any)
    }

    const goToGroupChat = async () => {

      if(!isConfirmed) return

        currentChat({
            room_id: event.id,
            type: 'group',
            name: event.name
        })
        router.push(`/chat/${event.id}` as any)
    }

    const handleGoing=async()=>{
      const res = await acceptEvent(event.id)

      if(!res){
        console.log("Fail to update")
        return
      }
      // update isConfirmed status in backend
      setIsComfirmed(true)
    }

    const handleDecline= async()=>{
      // remove user from event_user backend
      const res = await declineEvent(event.id)

      if(!res){
        console.log("Failed to decline event")
        return
      }

      // redirect use to home as they are not allow to access the event anymore
      router.push("/(root)/(tabs)/home")
    }

    const showAlert=()=>{
        Alert.alert(
            'Warning',
            `Do you want to decline this hangout invite?`,
            [
                {
                    text:'Cancel',
                    onPress:()=>console.log("cancel pressed"),
                    style:'cancel'
                },
                {
                    text:"Continue",
                    onPress:()=> {
                        console.log("Proceed to update")
                        handleDecline()
                    },
                }
            ]
        )
    }

    const confirmedIcon =(
      <View
      className='absolute right-0 bottom-0 w-[25px] aspect-square rounded-full bg-green-100 flex items-center justify-center'
      >
        <EvilIcons name="check" size={20} color="green" />
      </View>
    )

    const pendingIncon =(
      <View
      className='absolute right-0 bottom-0 w-[25px] aspect-square rounded-full bg-red-100 flex items-center justify-center'
      >
        <EvilIcons name="question" size={20} color="red" />
      </View>
    )


  return (
    <View className="px-9 py-6 flex gap-8">
      <View className="w-full flex flex-row justify-end">
        {(!event.date || new Date() <= new Date(event.date)) ? isConfirmed?(
          <TouchableOpacity
            onPress={() => {
              console.log("Detail Card event", event);
              setSelectedEvent(event);
              router.push("/event/edit-event");
            }}
          >
            <Feather name="edit" size={24} color="black" />
          </TouchableOpacity>
        ):(
          <View
          className='flex flex-row gap-4 items-center'>
            <Text className='text-[16px]'>
              Going?
            </Text>
            <View
            className='flex flex-row gap-8'>
              <TouchableOpacity
              onPress={handleGoing}>
                <Feather name="check" size={24} color="green" />
              </TouchableOpacity>
              <TouchableOpacity
              onPress={showAlert}>
                <Feather name="x" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ):<View/>}
      </View>
      {/* Event Name */}
      <View className="pb-4">
        <Text className="text-4xl font-MontserratMedium text-center">
          {event.name}
        </Text>
      </View>
      {/* data and time */}
      <View
        className={`flex gap-8 flex-row items-center ${Platform.OS === "android" && "px-6"}`}
      >
        <View className="w-[50px] h-[50px] justify-center items-center rounded-xl bg-[rgba(9,37,104,0.1)]">
          <Ionicons name="calendar" size={30} color="#092568" />
        </View>

        {event.date ? (
          <View className="flex gap-1">
            <Text className="font-LexendMedium text-[20px]">
              {day} {month}, {year}
            </Text>
            <Text className="text-[#747688] text-lg">
              {wod}, {hour! < 10 ? `0${hour}` : hour}:
              {mins! < 10 ? `0${mins}` : mins}
            </Text>
          </View>
        ) : (
          <View className="flex-1">
            <Text
              style={styles.notProvidedText}
              className="font-LexendSemiBold"
            >
              NOT PROVIDED
            </Text>
          </View>
        )}
      </View>

      {/* Location */}
      <View
        className={`flex gap-8 flex-row items-center ${Platform.OS === "android" && "px-6"}`}
      >
        <View className="w-[50px] h-[50px] justify-center items-center rounded-xl bg-[rgba(9,37,104,0.1)]">
          <FontAwesome6 name="location-dot" size={30} color="#092568" />
        </View>
        {event.place?.address || event.place?.place_name ? (
          <View className="flex gap-1">
            <Text className="font-LexendMedium text-[20px] w-[90%]">
              {event.place.place_name ?? "TBD"}
            </Text>
            <Text className="text-[#747688] text-lg w-[100%] text-wrap">
              {event.place.address}
            </Text>
          </View>
        ) : (
          <View className="flex-1">
            <Text
              style={styles.notProvidedText}
              className="font-LexendSemiBold"
            >
              NOT PROVIDED
            </Text>
          </View>
        )}
      </View>

      {/* Members */}
      <View className="py-3">
        <Text className="font-MontserratSemiBold text-[20px] pb-6">
          Members
        </Text>
        <View className=" flex flex-row gap-10 items-center">
          <View className="flex flex-row gap-1">
            {event.members.length > 3
              ? event.members.slice(0, 3).map((m) => (
                  <TouchableOpacity
                    disabled={m.userId === user?.id}
                    onPress={() => handleDirectDmRoom(m)}
                    key={m.userId}
                  >
                    <Image
                      className="w-[75px] aspect-square rounded-full"
                      style={styles.picStyle}
                      source={m.image ? { uri: m.image } : defalutImage.user}
                      resizeMode="cover"
                    />
                    {m.isConfirmed?confirmedIcon:pendingIncon}
                  </TouchableOpacity>
                ))
              : event.members.map((m) => (
                  <TouchableOpacity
                    disabled={m.userId === user?.id}
                    onPress={() => handleDirectDmRoom(m)}
                    key={m.userId}
                    className='relative'
                  >
                    <Image
                      className="w-[75px] aspect-square rounded-full"
                      style={styles.picStyle}
                      source={m.image ? { uri: m.image } : defalutImage.user}
                      resizeMode="cover"
                    />
                    {m.isConfirmed?confirmedIcon:pendingIncon}
                  </TouchableOpacity>
                ))}
          </View>

          {/* {event.members.length > 3 && ( */}
            <Link href={`/members/${event.id}`}>
              <Text>See More</Text>
            </Link>
          {/* )} */}
        </View>
      </View>


      {isConfirmed&&<TouchableOpacity
      onPress={()=>
      goToGroupChat()}>
        <Text
        className='text-lg text-center font-LexendSemiBold'>
            Message in Group
        </Text>
      </TouchableOpacity>}
    </View>
  );
};

export default DetailCard;

const styles = StyleSheet.create({
  notProvidedText: {
    color: "#9CA4AB",
    fontSize: 18,
  },
  picStyle: {
    width: 75,
    height: 75,
    borderRadius: 9999,
  },
});
