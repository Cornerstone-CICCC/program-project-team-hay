import { EventDetail } from '@/app/(root)/event/[id]'
import { useIsTrackAvailable } from '@/hooks/useIsTrackAvailable'
import { useAuthStore } from '@/store/functions/auth.store'
import { Link, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps'



const AvailablePreviewMap =({latitude, longitude}:{
  latitude:number,
  longitude:number
})=>{
  const {id} = useLocalSearchParams()
  return(
        <View
            className='py-4 w-full h-[180px] rounded-xl realtive'
            >
            <Link
            href={`/(root)/track/${id}`}
            >
              {Platform.OS !== 'web'&&
                <MapView
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
              className='w-full h-full rounded-2xl'
              scrollEnabled={false}
              tintColor='black'
              style={styles.map}
              mapType='standard'
              showsPointsOfInterest={false}
              initialRegion={{ 
                  latitude, 
                  longitude, 
                  latitudeDelta: 0.005, 
                  longitudeDelta: 0.005 }}
              showsUserLocation={true}
              userInterfaceStyle='light'
              >
                  <Marker
                  key="location-mark"
                  coordinate={{
                      latitude,
                      longitude
                  }}
                  />
              </MapView>}
            </Link>
      </View>
  )
}


const UnavailablePreviewMap =({latitude, longitude, isConfirmed}:{
  latitude:number,
  longitude:number
  isConfirmed:boolean
})=>{
  return (
          <View
          className={`py-4 w-full h-[180px] rounded-xl realtive`}
            style={{
              borderRadius:25
            }}
            pointerEvents='none'
            >
            {Platform.OS !== 'web'&&
              <MapView
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            className='w-full h-full rounded-2xl'
            scrollEnabled={false}
            tintColor='black'
            style={styles.map}
            mapType='standard'
            showsPointsOfInterest={false}
            initialRegion={{ 
                latitude, 
                longitude, 
                latitudeDelta: 0.005, 
                longitudeDelta: 0.005 }}
            showsUserLocation={true}
            userInterfaceStyle='light'
            >
                <Marker
                key="location-mark"
                coordinate={{
                    latitude,
                    longitude
                }}
                />
            </MapView>}
          <View
        className={`absolute top-4 w-full h-full bg-black/70 z-10 items-center justify-center ${Platform.OS !== "android" &&"rounded-2xl"}`}>
          <Text
          className='text-white text-center'>
            {isConfirmed?"Tracking is available 1 hr before meetup time":"You need to join to use tracking"}
          </Text>
          </View>
      </View>
  )
}

const TrackPreview = ({event}:{event:EventDetail}) => {
  const [isConfirmed, setIsComfirmed] = useState<boolean>(true)
  const {user} = useAuthStore()

  const isTrackAvailable = useIsTrackAvailable(event.date??null)
  console.log(isTrackAvailable)

    useEffect(()=>{
      const members = event.members
      const me = members.find(m=>m.userId===user?.id)
      const isConfirm = me?.isConfirmed ?? false
      setIsComfirmed(isConfirm)
    },[event, user])

  // if date-time and location is not defined then 
  if(!event.date || !event.place||!event.place.latitude ||!event.place.longitude){
    return (
    <View
    className='px-10 py-6'>
      <Text
      className='font-MontserratSemiBold text-[20px]'>
        Track Members
      </Text>
      <View
      className='w-full h-[180px] flex justify-center items-center'>
        <Text
        className='font-Lexend'
        style={styles.notProvidedText}>
          Please provide date and location
        </Text>

      </View>
    </View>
    )
  }



  // //check if it is a hour before start time every minute
  // useEffect(()=>{
  //   const check =()=>{
  //     const oneHourBefore = new Date(event.date)
  //     oneHourBefore.setHours(oneHourBefore.getHours()-1)
  //     setIsTrackAvailable(new Date()>= oneHourBefore)
  //   }

  //   check()
  //   const interval = setInterval(check, 60000)
  //   return()=>clearInterval(interval)
  // },[event.date])

  return (
    <View
    className='px-10 py-6'>
      <Text
      className='font-MontserratSemiBold text-[20px]'>
        Track Members
      </Text>

     {/* Preview available 1 hr before start time */}
      {Platform.OS==="web"?
      <Text>
        This service is only available on mobile
      </Text>:
      isTrackAvailable&&isConfirmed?
        <AvailablePreviewMap
        longitude={event.place.longitude} 
        latitude={event.place.latitude}
        />:
        <UnavailablePreviewMap 
        longitude={event.place.longitude} 
        latitude={event.place.latitude}
        isConfirmed={isConfirmed}/>
      }
    </View>
  )
}

export default TrackPreview

const styles = StyleSheet.create({
    map:{
        width:'100%',
        height:'100%',
        borderRadius:20,
    },
    notProvidedText:{
        color:"#9CA4AB",
        textAlign:'center',
        fontSize:18,
    }
})