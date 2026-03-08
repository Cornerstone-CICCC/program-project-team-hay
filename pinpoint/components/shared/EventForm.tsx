import { EventDetail } from '@/app/(root)/event/[id]';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import GoogleTextInput from '../GoogleTextInput';
import DateTimeInput from './DateTimeInput';

type Prop={
    eventDetail?:EventDetail
}

export interface Place{
    place_name:string,
    address:string,
    latitude:number,
    longitude:number
    url?:string,
    imgKey?:string,
}

export interface EventForm{
    name:string,
    date:Date,
    place:Place,
    members:{
    id:string,
    name:string,
    avatar:string
    }[]
} 

// reuse this form for create and edit

const EventForm = (props:Prop) => {
    const [eventForm, setEventForm ] = useState<Omit<EventDetail,'id'>>({
        name:"",
        date:new Date().toString(),
        place:{
        place_name:"",
        address:"",
        latitude:0,
        longitude:0,
        url:"",
        imgKey:"",
        },
        members:[{
            id:"1",
            name:"Joe",
            avatar:""
        }]//add user (yourself initially)
        })

    const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {

    // if (Platform.OS === 'android') setShowDatePicker(false);  // auto-close on Android
        if (event.type === 'set' && selected) {
            const updated = eventForm?.date?new Date(eventForm.date):new Date()
            updated.setFullYear(selected.getFullYear())
            updated.setMonth(selected.getMonth())
            updated.setDate(selected.getDate())

            setEventForm(prev =>({
                ...prev,
                date:updated.toString()
            }))

        }
    };

    const onTimeChange = (event: DateTimePickerEvent, selected?: Date)=>{
        if (event.type === 'set' && selected) {
            const updated = eventForm?.date?new Date(eventForm.date):new Date()
            updated.setHours(selected.getHours())
            updated.setMinutes(selected.getMinutes())
            setEventForm(prev =>({
                ...prev,
                date:updated.toString()
            }))
        }
    }

    const locationSaveHandler = (place:Place)=>{
        if(!place) return
        setEventForm(prev=>({
            ...prev,
            place
        }))
    }

    const submitEventForm =async()=>{
        if(eventForm.name.trim()!==""||eventForm.members.length<2){
            console.log("Title is not entered or member is not added")
            return
        }
        console.log(eventForm)
        setEventForm({
        name:"",
        date:new Date().toString(),
        place:{
        place_name:"",
        address:"",
        latitude:0,
        longitude:0,
        url:"",
        imgKey:"",
        },
        members:[]
        })
    }

    useEffect(()=>{
        if(!props.eventDetail) return

        const event = props.eventDetail

        setEventForm({
            name:event.name,
            date:event.date,
            place:event.place,
            members:event.members
        })

    },[])
  return (
    <View
    className='pt-12 flex flex-col gap-12'
    >
        <View>
            <Text
            style={styles.headText}
            >
                Title
            </Text>
            <TextInput
            value={eventForm?.name}
            placeholder='Enter hangout title'
            placeholderTextColor="#ACACAC"
            onChangeText={(text)=>{
                setEventForm(prev=>({
                    ...prev,
                    name:text
                }))
            }}
            style={styles.textIput}
            />
        </View>

        {/* Location */}
        <View
        className='flex flex-col gap-3'
        >
            <Text
            style={styles.headText}>
                Location
            </Text>
            <View
            style={styles.locationInputBox}>
                <View>
                <EvilIcons 
                className='self-start'
                name="location" size={26} color="#848484" />
                </View>
                <View
                className='w-[80%] pe-4'>
                    <GoogleTextInput 
                    type='new'
                    setNewLocation={locationSaveHandler}
                    />
                </View>
            </View>
        </View>

        <View>
            <Text
            style={styles.headText}>
                Time
            </Text>
                <DateTimeInput
                eventForm={eventForm}
                onDateChange={onDateChange}
                onTimeChange={onTimeChange}/>


        </View>
        {/* Friends  */}
        <View>
            <Text
            style={styles.headText}>
                Friends
            </Text>
            <View
            className='flex flex-row gap-4 items-center justify-between px-4'>
                {
                    (eventForm && eventForm.members.length>0)&&
                    <View>
                        {
                        eventForm.members.map(m=>(
                            <View
                            key={m.id}
                            style={{
                                borderRadius:"50%"
                            }}
                            className='w-[80px] aspect-square bg-slate-400'>
                            </View>
                        ))
                            
                        }
                        
                    </View>
                }
                <TouchableOpacity
                className='pe-16'>
                    <AntDesign name="plus" size={30} color="#092568" />
                </TouchableOpacity>
            </View>
        </View>

        <TouchableOpacity
        onPress={submitEventForm}
        className='py-4 bg-[#FF7600] rounded-2xl'>
            <Text
            className='text-white text-xl text-center font-LexendMedium'>Create</Text>
        </TouchableOpacity>

    </View>
  )
}

export default EventForm

const styles = StyleSheet.create({
    headText:{
        fontFamily: "Montserrat",
        fontWeight:"medium",
        fontSize:23,
        color:'#595959',
        paddingBottom:15
    },

    textIput:{
        borderStyle:'solid',
        borderRadius:10,
        borderColor:'rgba(130,130,130,0.7)',
        borderWidth:1,
        paddingHorizontal:25,
        paddingVertical:20,
        fontSize:18
    },
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

    locationInputBox:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        borderStyle:'solid',
        borderWidth:1,
        borderColor:'rgba(130,130,130,0.7)',
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:2,
        width:"100%",
        marginBottom:8,
        zIndex:100,
        overflow:'visible'
    }
})