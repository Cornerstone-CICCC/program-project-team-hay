import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const TrackPreview = () => {
  return (
    <View
    className='px-10 py-6'>
      <Text
      className='font-MontserratSemiBold text-[20px]'>
        Track Members
      </Text>

      <Text>
        This service is only available on mobile
      </Text>
    </View>
  )
}

export default TrackPreview

const styles = StyleSheet.create({})