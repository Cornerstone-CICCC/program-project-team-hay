import DetailCard from '@/components/event-detail/DetailCard'
import PlaceCard from '@/components/event-detail/PlaceCard'
import PollForm from '@/components/event-detail/PollForm'
import TrackPreview from '@/components/event-detail/TrackPreview'
import { images } from '@/constants'
import { fetchEventBgImage } from '@/libs/eventImgHandler'
import { useLocationStore } from '@/store/location.store'
import AntDesign from '@expo/vector-icons/AntDesign'
import * as Location from 'expo-location'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'

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
        url?:string,
        imgKey?:string,
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

    const event:EventDetail = {
      id: "1",
      name: "Coffee Meetup",
      date: "2026-03-14T16:00",
      place:{
        place_name: "Startbucks Coffee Company",
        address: "West Pender Street, Vancouver, BC, Canada",
        latitude:49.28463,
        longitude:-123.1151,
        url:"https://maps.google.com/?cid=1502409917068404389",
        imgKey:'ATCDNfVapP_-XKGN0BYKcnl9NhZMg9WgA0RmeHFqX1zlnr-HVeOTZ-Aw8AijXxpnUXIEVmruHq5QH3NUkpAkeGtCiSHvkw1_vsxYFWCdsEM-2Cq6fFGa3jL-ybRal_Ov2QhfqXUrWx-rlUoJ1u2Q2p3VRZCZuh45rLUNXB-VSQS4bXYcHHkbgKzVfuKoLqtseNT3LWwEUxj7qjU4R83qi0Iwxg1udk_Qr1lJo76_Y7gXi4Ub8Tnqw728alXwm79vxGlEjtseQL_Pd1c3Y2YqHXPXsNwoTbYD3ata0OJW2SYnYyJyZM9L9E3ieJh1owZZJU3dQn8nwZLcOasSRHfi2qCzwBChinx3eEkVMtKq71c7cNvQdCWeeK0gQr3Njhdt33Ddrtj4grIZJm-3AMsR9jqSWygGVDNIU7fou9vGehVwpHJNQw'
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
              <TouchableOpacity>
                <AntDesign 
                name="arrow-left"
                 size={30} 
                 color="black" />
              </TouchableOpacity>
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
