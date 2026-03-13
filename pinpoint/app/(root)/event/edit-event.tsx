import EventForm from '@/components/shared/EventForm'
import AntDesign from '@expo/vector-icons/AntDesign'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useEventStore } from '@/store/event.store'
import { router } from 'expo-router'
import { EventDetail } from './[id]'

const EditEvent = () => {
    const {selectedEvent} = useEventStore()
    const [data, setData] = useState<EventDetail| null>(null)

    useEffect(()=>{
        if(!selectedEvent) return

        setData(selectedEvent)
    },[selectedEvent])

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
          onPress={()=>router.back()}>
            <AntDesign name="arrow-left" size={24} color="black" />
          </TouchableOpacity>

            <Text
            className='font-MontserratBold text-3xl'>
                Hangout Detail
            </Text>
            <View/>
        </View>
         {data&&<EventForm eventDetail={data}/>}
        </View>
      }
    />
    </View>
  )
}

export default EditEvent

const styles = StyleSheet.create({})