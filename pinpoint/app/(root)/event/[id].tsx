import { FlatList, Image, ScrollView, Text, View } from 'react-native'
import * as Location from 'expo-location'
import React, { useEffect, useState } from 'react'
import { fetchEventBgImage } from '@/libs/eventImgHandler'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams } from 'expo-router';
import DetailCard from '@/components/event-detail/DetailCard';
import { images } from '@/constants';
import { useLocationStore } from '@/store/location.store'
import PollForm from '@/components/event-detail/PollForm'
import PlaceCard from '@/components/event-detail/PlaceCard'
import TrackPreview from '@/components/event-detail/TrackPreview'

// Disirable returning type for event
export interface EventDetail {
      id:string,
      name:string,
      date:string,
      place:{
        place_name:string,
        address:string,
        latitude:number,
        longitude:number
        url?:string
      }
      members:{
        id:string,
        name:string,
        avatar:string
      }[]
}
const EventDetail = () => {
    const {id} = useLocalSearchParams()
    const {setUserLocation} = useLocationStore()
    const [bgImg,setBgImg] = useState(images.defaultImg)
    const [hasPermission, setHasPermission] = useState(false)
    const [eventDetail,setEventDetail] = useState<null|EventDetail>()

    const event = {
      id: "1",
      name: "Coffee Meetup",
      date: "2026-03-14T16:00",
      place:{
        place_name: "Startbucks Coffee Company",
        address: "West Pender Street, Vancouver, BC, Canada",
        latitude:49.28463,
        longitude:-123.1151,
        url:"https://maps.google.com/?cid=1502409917068404389",
      },
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

    //fetching data
    useEffect(()=>{
      //Fetching event detail from id

      setEventDetail(event)
      const bgImage = fetchEventBgImage(event.name)
      setBgImg(bgImage)
    },[id])

    useEffect(()=>{
    const requestLocation = async()=>{
      let {status} = await Location.requestForegroundPermissionsAsync()
      if(status!=='granted'){
        setHasPermission(false)
        return
      }

      let location =await Location.getCurrentPositionAsync()

      const address=await Location.reverseGeocodeAsync({
        latitude:location.coords.latitude!,
        longitude:location.coords.longitude!
      })

      setUserLocation({
        latitude:location.coords.latitude,
        longitude:location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`
      })

    }


    requestLocation()
  },[])

    if(!eventDetail){
      return (
        <Text>
          Nothing to show
        </Text>
      )
    }

  
  return (
    <View
    className='font-Lexend pb-16'>
    <FlatList
      data={[]}
      renderItem={null}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 15 }}
      ListHeaderComponent={
        <View>
          {/* Hero Image */}
          <View className='relative'>
            <Image
              source={bgImg}
              className='w-full h-[250px] opacity-80'
              resizeMode='cover'
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
          <DetailCard event={eventDetail} />
          <PollForm />
          <PlaceCard place={eventDetail.place}/>
          <TrackPreview event={eventDetail}/>
        </View>
      }
    />
    </View>
  )
}

export default EventDetail
