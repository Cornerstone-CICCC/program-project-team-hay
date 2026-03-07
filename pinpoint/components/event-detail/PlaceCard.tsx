import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router';
import { getGoogleImgUrl } from '@/constants';


const PlaceCard = ({place}:{place:{
        place_name:string,
        address:string,
        latitude:number,
        longitude:number
        url?:string
        imgKey?:string
}}) => {
    const [googleImgUrl, setGoogleImgUrl] = useState<string>("")

    useEffect(()=>{
        if(!place.imgKey) return
        const url = getGoogleImgUrl(place.imgKey)
        setGoogleImgUrl(url)

    },[place])
    return (
    <View
    className='px-10 py-4'>
      <Text
      className='font-MontserratSemiBold text-[20px]'>
        Place Information
      </Text>
      <Link
      href={place.url as any}
      >
        <View
        className='pt-6 pb-2 flex flex-row gap-4'>
            {place.imgKey?
            // <View
            // className='w-[80px] aspect-square'>
                <Image
                source={{
                    uri:googleImgUrl
                }}
                width={100}
                height={100}
                resizeMode='cover'
                className='rounded-2xl'
                />
            // </View>
            :<View
            className='w-[90px] aspect-square bg-slate-500'/>
            }
            <View
            className='flex flex-col justify-center gap-3 w-[220px] '>
                <Text
                className='font-LexendSemiBold text-xl flex-wrap'>
                    {place.place_name}
                </Text>
                <View
                className='flex flex-row items-center gap-1'>
                    <EvilIcons name="location" size={24} color="#9CA4AB" />
                    <Text
                    className='font-Lexend text-[#9CA4AB] w-[90%] text-wrap'>
                        {place.address}
                    </Text>
                </View>
            </View>
        </View>
        </Link>

      {/* Map preview */}
      <View
      className='py-4 w-full h-[180px] rounded-xl'
    //   pointerEvents='none'
      >
            {Platform.OS !== 'web'&&
            <MapView
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            className='w-full h-full rounded-2xl'
            scrollEnabled={true}
            tintColor='black'
            style={styles.map}
            mapType='mutedStandard'
            showsPointsOfInterest={false}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
            initialRegion={{ 
                latitude: place.latitude, 
                longitude: place.longitude, 
                latitudeDelta: 0.0922, 
                longitudeDelta: 0.0421 }}
            showsUserLocation={true}
            userInterfaceStyle='light'
            >
                <Marker
                key="location-mark"
                coordinate={{
                    latitude:place.latitude,
                    longitude:place.longitude
                }}
                />
            </MapView>}
      </View>
    </View>
  )
}

export default PlaceCard

const styles = StyleSheet.create({
    map:{
        width:'100%',
        height:'100%',
        borderRadius:20
    
    }
})