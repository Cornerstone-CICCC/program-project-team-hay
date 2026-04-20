import { EventDetail } from '@/app/(root)/event/[id]';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props={
    eventForm?:Omit<EventDetail,'id'>,
    dateValue?:Date,
    onDateChange:(event: DateTimePickerEvent, selected?: Date)=>void
    onTimeChange:(event: DateTimePickerEvent, selected?: Date)=>void
    type?:"poll"|"new" |"edit"
    isTimeTBD?:boolean
}

const DateTimeInput = ({
    eventForm,
    onDateChange,
    onTimeChange,
    dateValue,
    type,
    isTimeTBD,
}:Props) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [dateAndroid, setDateAndroid] = useState<Date | null>(new Date())

    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate()+7)

    useEffect(()=>{
        console.log("event date in date time",eventForm?.date)
        if(!eventForm?.date) return
        setDateAndroid(new Date(eventForm.date))

    },[])
  return (
            <View 
        className={`flex flex-row items-center w-full ${(type&&type!=="poll")&&"px-2 gap-8"} ${Platform.OS ==="ios"&& "justify-between"}`}
        style={{
            flexBasis:'auto',
        }}>
            
            <View
            style={styles.flexColContainer}>
                <Text
                className='text-lg'
                >Date</Text>
                <View
                style={(type&&type==="poll")?styles.pollDateTimeInputBox:styles.dateTimeInputBox}
                className={`${Platform.OS === 'android'&&"w-full"}`}>
                    <View
                    className={`${Platform.OS === 'android'&&"flex flex-row justify-between gap-6 py-1.5 px-4"}`}>
                        <FontAwesome5 name="calendar-alt" size={22} color="#848484" />

                        {Platform.OS === 'android' && (
                        <TouchableOpacity 
                        onPress={() => setShowDatePicker(true)}>
                            {dateAndroid?
                            <Text
                            className='text-[#ACACAC]'>
                                {dateAndroid.getFullYear()}/{dateAndroid.getMonth()<10?`0${dateAndroid.getMonth()+1}`:dateAndroid.getMonth()}/ {dateAndroid.getDate()}
                            </Text>
                            :<Text
                            className='text-[#ACACAC]'>
                                YYYY/MM/ DD
                            </Text>}
                        </TouchableOpacity>
                        )}
                    </View>
                          
                    <View style={{ opacity: isTimeTBD ? 0 : 1 }} pointerEvents={isTimeTBD ? 'none' : 'auto'}>
                        <DateTimePicker
                            value={dateValue ?? new Date(eventForm?.date ?? nextWeek)}
                            mode="date"
                            disabled={isTimeTBD ?? false}
                            display="compact"
                            themeVariant="light"
                            minimumDate={new Date()}
                            onChange={(e, date) => {
                                if (!date) return;
                                setShowDatePicker(false);
                                setDateAndroid(date);
                                onDateChange(e, date);
                            }}
                        />
                    </View>
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
                    <View
                    className={`${Platform.OS === 'android'&&"flex flex-row py-1.5 gap-6 px-4"}`}>
                        <AntDesign name="clock-circle" size={22} color="#848484" />
                    {Platform.OS === 'android' && (
                        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                            {dateAndroid?
                            <Text
                            className={`${Platform.OS==="android"&&"w-[80px]"} w-[100px] text-[#ACACAC]`}>
                                {dateAndroid.getHours()>12?dateAndroid.getHours()-12:dateAndroid.getHours()} : {dateAndroid.getMinutes()<10?`0${dateAndroid.getMinutes()}`:dateAndroid.getMinutes()} {dateAndroid.getHours()>12?"PM":"AM"}
                            </Text>
                            
                            :<Text
                            className={`${Platform.OS==="android"&&"w-[80px]"} w-[100px] text-[#ACACAC]`}>
                                HH : MM 
                            </Text>}
                        </TouchableOpacity>
                        )}
                    </View>
                    <View style={{ opacity: isTimeTBD ? 0 : 1 }} pointerEvents={isTimeTBD ? 'none' : 'auto'}>
                        <DateTimePicker
                            value={dateValue ?? new Date(eventForm?.date ?? nextWeek)}
                            mode="time"
                            disabled={isTimeTBD ?? false}
                            display="default"
                            themeVariant="light"
                            onChange={(e, date) => {
                                if (!date) return;
                                setShowTimePicker(false);
                                setDateAndroid(date);
                                onTimeChange(e, date);
                            }}
                        />
                    </View>
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