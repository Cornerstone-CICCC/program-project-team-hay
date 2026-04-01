import EventForm from '@/components/shared/EventForm';
import { useEventStore } from '@/store/event.store';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const createEvent = () => {
  const {setMembers} = useEventStore()
  return (
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
            <TouchableOpacity
            onPress={()=>{
              // clear the member store before leaving
              setMembers([])
              router.back()}}>
              <AntDesign name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
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