import { getGoogleImgUrl } from '@/constants';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';

type Props={
    place?:{
        place_name:string,
        address:string,
        latitude:number|null,
        longitude:number|null
        url?:string|null
        imgKey?:string|null
    }
}


const PlaceCard = ({place}:Props) => {
    const [googleImgUrl, setGoogleImgUrl] = useState<string>("")

    useEffect(()=>{
        if(!place) return

        if(place.imgKey){
        const url = getGoogleImgUrl(place.imgKey)
        setGoogleImgUrl(url)
        }
    },[place])

        // if place is not sent, then return empty card
    if(!place ||(place&&place.address==="")){
        return(
            <View
            className='px-10 py-4'>
                <Text
                className='font-MontserratSemiBold text-[20px]'>
                Place Information
                </Text>
                <View
                className='h-[150px] w-full flex justify-center items-center'>
                    <Text
                    style={styles.notProvidedText}
                    className='font-Lexend'>
                        Nothing to show
                    </Text>
                </View>
            </View>

        )
    }

    const content= (
        <View
        className='pt-6 pb-2 flex flex-row gap-4'>
            {place.imgKey?
                <Image
                source={{
                    uri:googleImgUrl
                }}
                width={100}
                height={100}
                resizeMode='cover'
                className='rounded-2xl'
                />
            :<View
            className='w-[90px] aspect-square bg-slate-500'/>
            }
            <View
            className='flex flex-col justify-center gap-3 w-[220px] '>
                <Text
                className='font-LexendSemiBold text-lg flex-wrap'>
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
        )

    return (
    <View
    className='px-10 py-4'>
      <Text
      className='font-MontserratSemiBold text-[20px]'>
        Place Information
      </Text>
      {place.url?
      <Link
      href={place.url as any}>{content}</Link>:
      <View>{content}</View>}

      {/* Map preview */}
      <View
      className='py-4 w-full h-[180px] rounded-xl'
      style={{
        borderRadius:25
      }}
    //   pointerEvents='none'
      >
            {Platform.OS !== 'web'&&(place.latitude&&place.longitude)&&
            <MapView
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            className='w-full h-full rounded-2xl'
            scrollEnabled={true}
            tintColor='black'
            style={styles.map}
            mapType='standard'
            showsPointsOfInterest={false}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
            initialRegion={{ 
                latitude: place.latitude, 
                longitude: place.longitude, 
                latitudeDelta: 0.005, 
                longitudeDelta: 0.005 }}
            showsUserLocation={false}
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
    
    },
    notProvidedText:{
        color:"#9CA4AB",
        textAlign:'center',
        fontSize:18,
    }
})