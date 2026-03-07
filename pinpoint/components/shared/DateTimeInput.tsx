import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { StyleSheet, Text, View } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React from 'react'
import { EventDetail } from '@/app/(root)/event/[id]';

type Props={
    eventForm?:Omit<EventDetail,'id'>,
    onDateChange:(event: DateTimePickerEvent, selected?: Date)=>void
    onTimeChange:(event: DateTimePickerEvent, selected?: Date)=>void
    type?:"poll"|"new"
}

const DateTimeInput = ({
    eventForm,
    onDateChange,
    onTimeChange,
    type
}:Props) => {
  return (
            <View 
        className={`flex flex-row items-center ${(type&&type==="poll")?"gap-2":"px-2 gap-8"}`}>
            
            <View
            style={styles.flexColContainer}>
                <Text
                className='text-lg'
                >Date</Text>
                <View
                style={(type&&type==="poll")?styles.pollDateTimeInputBox:styles.dateTimeInputBox}>
                    <View>
                        <FontAwesome5 name="calendar-alt" size={22} color="#848484" />
                    </View>
                    <DateTimePicker
                        value={new Date(eventForm?.date ?? new Date())}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        onChange={onDateChange}
                    />
                </View>
            </View>

            <View
            style={styles.flexColContainer}
            >
                <Text
                className='text-lg'
                >Time</Text>
                <View
                style={(type&&type==="poll")?styles.pollDateTimeInputBox:styles.dateTimeInputBox}>
                    <View>
                        <AntDesign name="clock-circle" size={22} color="#848484" />
                    </View>
                    <DateTimePicker
                        value={new Date(eventForm?.date ?? new Date())}
                        mode="time"
                        display="default"
                        minimumDate={new Date()}
                        onChange={onTimeChange}
                    />
                </View>
            </View>
            </View>
  )
}

export default DateTimeInput

const styles = StyleSheet.create({
    flexColContainer:{
        display:'flex',
        flexDirection:'column',
        gap:8
    },
    dateTimeInputBox:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        borderStyle:'solid',
        borderWidth:1,
        borderColor:'rgba(130,130,130,0.7)',
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:4
    },
    pollDateTimeInputBox:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:10,
        paddingVertical:4
    },
})