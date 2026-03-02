import { Image, ScrollView, Text, View } from 'react-native'
import React from 'react'
import { fetchEventBgImage } from '@/libs/eventImgHandler'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams } from 'expo-router';
const EventDetail = () => {
    const {id} = useLocalSearchParams()
    const event = {
        id:"1",
        name:"Coffee Meetup",
        "date_time":new Date(),
        address:"Starbuck"
    }

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
    </ScrollView>
    </View>
  )
}

export default EventDetail
