import { getGoogleImgUrl } from '@/constants'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import { Link } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

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

    </View>
  )
}

export default PlaceCard

const styles = StyleSheet.create({})