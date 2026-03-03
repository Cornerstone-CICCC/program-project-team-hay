import { Image, ScrollView, Text, View } from 'react-native'
import React from 'react'
import { fetchEventBgImage } from '@/libs/eventImgHandler'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams } from 'expo-router';
import DetailCard from '@/components/event-detail/DetailCard';
const EventDetail = () => {
    const {id} = useLocalSearchParams()

 const event = {
  id: "1",
  name: "Coffee Meetup",
  date: "2026-03-14T16:00",
 placeName: "Starbucks",
    address: "36 Guild Street",
  members: [
    {
      id: "user-1",
      name: "Emma Watson",
      avatar: "/avatars/emma.jpg",
    },
    {
      id: "user-2",
      name: "Chris Evans",
      avatar: "/avatars/chris.jpg",
    },
    {
      id: "user-3",
      name: "Tom Holland",
      avatar: "/avatars/tom.jpg",
    },
  ],
};

    const bgImage = fetchEventBgImage(event.name)
  return (
    <View
    className='font-Lexend'>
    <ScrollView
    contentContainerStyle={{
        paddingBottom:8
    }}
    >
        <View
        className='relative'>
            <Image
            source={bgImage}
            className='w-full h-[250px] opacity-80'
            resizeMode='stretch'
            />
            <View
            className='absolute top-[4rem] flex flex-row justify-between items-center w-full px-4 py-3'>
                <AntDesign 
                name="arrow-left"
                 size={30} 
                 color="black" />
                 <Text className='justify-self-center text-3xl font-LexendBold'>
                    Hangout Details
                 </Text>
                 <View></View>

            </View>
        </View>

        {/* Information card */}
        <DetailCard event={event}/>
    </ScrollView>
    </View>
  )
}

export default EventDetail
