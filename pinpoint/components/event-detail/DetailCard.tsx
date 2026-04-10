import { EventDetail } from '@/app/(root)/event/[id]';
import { Member } from '@/app/(root)/members/[id]';
import { defalutImage } from '@/constants';
import { useMyEventStore } from '@/store/event.store';
import { useAuthStore } from '@/store/functions/auth.store';
import { useFriendStore } from '@/store/functions/friend.store';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DetailCard = ({event}:{event:EventDetail}) => {
    const {user} = useAuthStore()
    const {createDmRoom} = useFriendStore()
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

    const handleDirectDmRoom = async(item:Member)=>{
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
  return (
    <View
    className='px-9 py-6 flex gap-8'>
        <View
        className='w-full flex flex-row justify-end'>
            {!(event.date&&new Date()>new Date(event.date))&&
                <TouchableOpacity
            onPress={()=>{
                console.log("Detail Card event",event)
                setSelectedEvent(event)
                router.push('/event/edit-event')}
            }
            >
                <Feather name="edit" size={18} color="black" />
            </TouchableOpacity>}
        </View>
        {/* Event Name */}
        <View
        className='pb-4'>
            <Text
            className='text-4xl font-MontserratMedium text-center'>{event.name}</Text>
        </View>
        {/* data and time */}
      <View
      className={`flex gap-8 flex-row items-center ${Platform.OS==="android"&&"px-6"}`}>
        <View
        className='w-[50px] h-[50px] justify-center items-center rounded-xl bg-[rgba(9,37,104,0.1)]'>
            <Ionicons name="calendar" size={30} color="#092568" />
        </View>

        {event.date?
            <View
        className='flex gap-1'>
                <Text
                className='font-LexendMedium text-[20px]'>{day} {month}, {year}</Text>
                <Text
                className='text-[#747688] text-lg'>
                    {wod}, {hour!<10?`0${hour}`:hour}:{mins!<10?`0${mins}`:mins}
                </Text>
            </View>:
            <View
            className='flex-1'>
                <Text
                style={styles.notProvidedText}
                className='font-LexendSemiBold'>NOT PROVIDED</Text>
            </View>
        }

      </View>

      {/* Location */}
      <View
      className={`flex gap-8 flex-row items-center ${Platform.OS==="android"&&"px-6"}`}>
        <View
        className='w-[50px] h-[50px] justify-center items-center rounded-xl bg-[rgba(9,37,104,0.1)]'>
            <FontAwesome6 name="location-dot" size={30} color="#092568" />
        </View>
        {event.place?
        <View
        className='flex gap-1'>
            <Text
            className='font-LexendMedium text-[20px] w-[90%]'>
                {event.place.place_name}</Text>
            <Text
            className='text-[#747688] text-lg w-[90%] text-wrap'>
                {event.place.address}
            </Text>
        </View>:
        <View
        className='flex-1'>
            <Text
            style={styles.notProvidedText}
            className='font-LexendSemiBold'>NOT PROVIDED</Text>
        </View>
        }
      </View>

      {/* Members */}
      <View
      className='py-3'>
        <Text
        className='font-MontserratSemiBold text-[20px] pb-6'>Members</Text>
        <View
         className=' flex flex-row gap-12 items-center'>
            <View
            className='flex flex-row gap-1'>
            {event.members.length>3 ? event.members.slice(0,3).map
            (m=>(
                <View
                key={m.userId}>
                    <Image
                    className='w-[75px] aspect-square rounded-full'
                    style={styles.picStyle}
                    source={m.image ?{uri:m.image}:defalutImage.user}
                    resizeMode='cover'
                    />
                    {/* <View
                    className='w-[75px] aspect-square rounded-full bg-gray-400'
                    /> */}
                </View>
            )):
            event.members.map(m=>(
                <TouchableOpacity
                onPress={()=>handleDirectDmRoom(m)}
                key={m.userId}>
                    <Image
                    className='w-[75px] aspect-square rounded-full'
                    style={styles.picStyle}
                    source={m.image ?{uri:m.image}:defalutImage.user}
                    resizeMode='cover'
                    />
                </TouchableOpacity>
            ))}
            </View>

            {event.members.length>3&&
            <Link
            href={`/members/${event.id}`}>
                <Text>See More</Text>
            </Link>}
        </View>
      </View>


      <TouchableOpacity
      onPress={()=>router.push(`/chat/${event.id}` as any)}>
        <Text
        className='text-lg text-center font-LexendSemiBold'>
            Message in Group
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default DetailCard

const styles = StyleSheet.create({
    notProvidedText:{
        color:"#9CA4AB",
        textAlign:'center',
        fontSize:18,
    },
    picStyle:{
        width:75,
        height:75,
        borderRadius:9999
    }
})

