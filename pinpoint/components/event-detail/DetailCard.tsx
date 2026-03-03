import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface Event{
    id:string,
    name:string,
    date:string,
    placeName:string,
    address:string
    members:{
        id:string,
        name:string,
        avatar:string
    }[]
}
const DetailCard = ({event}:{event:Event}) => {
    const dateTime = new Date(event.date)
    const day = dateTime.getDate();
    const month = dateTime.toLocaleString("en-CA", { month: "long" });
    const year = dateTime.getFullYear();
    const wod = new Intl.DateTimeFormat("en-CA", {
        weekday: "long",
        }).format(dateTime);
    const hour = dateTime.getHours()
    const mins = dateTime.getMinutes()

    const addFriendHandler =()=>{
        //redirect to list of friends
    }


  return (
    <View
    className='px-9 py-6 flex gap-8'>
        {/* Event Name */}
        <View
        className='py-4'>
            <Text
            className='text-4xl font-MontserratMedium text-center'>{event.name}</Text>
        </View>
        {/* data and time */}
      <View
      className='flex gap-20 flex-row'>
        <View
        className='w-[50px] h-[50px] justify-center items-center rounded-xl bg-[rgba(9,37,104,0.1)]'>
            <Ionicons name="calendar" size={30} color="#092568" />
        </View>

        <View
        className='flex gap-1'>
            <Text
            className='font-LexendMedium text-2xl'>{day} {month}, {year}</Text>
            <Text
            className='text-[#747688] text-lg'>
                {wod}, {hour<10?`0${hour}`:hour}:{mins<10?`0${mins}`:mins}
            </Text>
        </View>

      </View>

      {/* Location */}
      <View
      className='flex gap-20 flex-row'>
        <View
        className='w-[50px] h-[50px] justify-center items-center rounded-xl bg-[rgba(9,37,104,0.1)]'>
            <FontAwesome6 name="location-dot" size={30} color="#092568" />
        </View>
        <View
        className='flex gap-1'>
            <Text
            className='font-LexendMedium text-2xl'>{event.placeName}</Text>
            <Text
            className='text-[#747688] text-lg'>
                {event.address}
            </Text>
        </View>
      </View>

      {/* Members */}
      <View
      className='py-3'>
        <Text
        className='font-MontserratMedium text-2xl pb-6'>Members</Text>
        <View
         className=' flex flex-row gap-14 items-center'>
            <View
            className='flex flex-row'>
            {event.members.map(m=>(
                <View
                key={m.id}>
                    {/* <Image
                    
                    /> */}
                    <View
                    className='w-[75px] aspect-square rounded-full bg-gray-400'
                    />
                </View>
            ))}
            </View>

            <TouchableOpacity
            onPress={addFriendHandler}>
                <FontAwesome6 name="add" size={40} color="#092568" />
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default DetailCard

