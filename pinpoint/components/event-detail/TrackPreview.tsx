import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import { EventDetail } from '@/app/(root)/event/[id]'
import { router } from 'expo-router'



const AvailablePreviewMap =({latitude, longitude}:{
  latitude:number,
  longitude:number
})=>{
  return(
        <View
            className='py-4 w-full h-[180px] rounded-xl realtive'
            pointerEvents='none'
            >
            <TouchableOpacity
            // onPress={router.push()}
            >
              <MapView
              provider={PROVIDER_DEFAULT}
              className='w-full h-full rounded-2xl'
              scrollEnabled={false}
              tintColor='black'
              style={styles.map}
              mapType='mutedStandard'
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
              </MapView>
            </TouchableOpacity>
      </View>
  )
}


const UnavailablePreviewMap =({latitude, longitude}:{
  latitude:number,
  longitude:number
})=>{
  return (
          <View
            className='py-4 w-full h-[180px] rounded-xl realtive'
            pointerEvents='none'
            >
            <MapView
            provider={PROVIDER_DEFAULT}
            className='w-full h-full rounded-2xl'
            scrollEnabled={false}
            tintColor='black'
            style={styles.map}
            mapType='mutedStandard'
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
            </MapView>
          <View
        className='absolute rounded-2xl top-4 w-full h-full bg-black/70 z-10 items-center justify-center'>
          <Text
          className='text-white text-center'>
            Tracking is available 1 hr before meetup time
          </Text>
          </View>
      </View>
  )
}
const TrackPreview = ({event}:{event:EventDetail}) => {
  const [isTrackAvailable, setIsTrackAvailable] = useState(false)

  //check if it is a hour before start time every minute
  useEffect(()=>{
    const check =()=>{
      const oneHourBefore = new Date(event.date)
      oneHourBefore.setHours(oneHourBefore.getHours()-1)
      setIsTrackAvailable(new Date()>= oneHourBefore)
    }

    check()
    const interval = setInterval(check, 60000)
    return()=>clearInterval(interval)
  },[event.date])

  return (
    <View
    className='px-10 py-6'>
      <Text
      className='font-MontserratSemiBold text-[20px]'>
        Track Members
      </Text>

     {/* Preview available 1 hr before start time */}
      {isTrackAvailable?
        <View>
        </View>:
        <UnavailablePreviewMap 
        longitude={event.place.longitude} 
        latitude={event.place.latitude}/>
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
    }
})