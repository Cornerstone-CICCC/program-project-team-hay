import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import EventForm from '@/components/shared/EventForm'


const createEvent = () => {
  return (
    // <View
    // style={{
    //   flex:1
    
    // }}
    // className='pt-24 pb-10 px-6'>
    //     <View
    //     className='flex flex-row justify-between'>
    //         <AntDesign name="arrow-left" size={24} color="black" />
    //         <Text
    //         className='font-MontserratBold text-3xl'>
    //             Hangout Detail
    //         </Text>
    //         <View/>
    //     </View>
    //     <EventForm/>
    // </View>

    <View
    style={{flex:1}}
    className='px-6 pt-16 bg-white'>
    <FlatList
      data={[]}
      renderItem={null}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 15 }}
      ListHeaderComponent={
        <View>
        <View
        className='flex flex-row justify-between mt-15'>
            <AntDesign name="arrow-left" size={24} color="black" />
            <Text
            className='font-MontserratBold text-3xl'>
                Hangout Detail
            </Text>
            <View/>
        </View>
         <EventForm/>
        </View>
      }
    />
    </View>
  )
}

export default createEvent

const styles = StyleSheet.create({})