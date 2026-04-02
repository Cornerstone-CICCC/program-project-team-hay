import { formatDateTime } from '@/libs/format';
import { useMyEventStore } from '@/store/event.store';
import { Accordion } from '@animatereactnative/accordion';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Link } from 'expo-router';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import GoogleTextInput from '../GoogleTextInput';
import DateTimeInput from '../shared/DateTimeInput';

export type PollQuestion = "place" | "date"

export type PlaceOption ={
    placeNeme:string,
    address:string,
    latitude:number,
    longitude:number,
    url?:string,
    imgKey?:string
  }

const DateOptionInputs =({addOptions, setIsInputShown}:
    {addOptions:Dispatch<SetStateAction<Date[]>>,setIsInputShown:Dispatch<SetStateAction<boolean>>})=>{
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [msg, setMsg] = useState<string>("")

  const onChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);  // auto-close on Android
    if (event.type === 'set' && selected) {
      setDate(selected);
    }
  };

    const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {

    if (Platform.OS === 'android') setShowDatePicker(false);  // auto-close on Android
        if (event.type === 'set' && selected) {
            const updated = date?new Date(date):new Date()
            updated.setFullYear(selected.getFullYear())
            updated.setMonth(selected.getMonth())
            updated.setDate(selected.getDate())

            setDate(updated)
        }
    };
  
    const onTimeChange = (event: DateTimePickerEvent, selected?: Date)=>{
    if (Platform.OS === 'android') setShowDatePicker(false);
        if (event.type === 'set' && selected) {
            const updated = date?new Date(date):new Date()
            updated.setHours(selected.getHours())
            updated.setMinutes(selected.getMinutes())
            setDate(updated)
        }
    }

  const optionSaveHandler=()=>{
    const today = new Date()
    today.setHours(0,0,0,0)

    const dateOption = new Date(date)
    dateOption.setHours(0,0,0,0)

    if(dateOption<=today){
        setMsg("Date needs to be later than today")
        return
    }

    addOptions(prev=>[...prev, date])
    setIsInputShown(false)
  }

    return(
    <View 
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {Platform.OS === 'android' && (
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        </TouchableOpacity>
      )}
      
      <View>
        {/* {showDatePicker && (
                <DateTimePicker
                    testID="startDatePicker"
                    value={date}
                    mode="datetime"
                    display="default"
                    minimumDate={new Date()}
                    onChange={onChange}
                />
        )} */}
        {showDatePicker &&<DateTimeInput
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        type='poll'/>}
        {msg&&
            <Text
            className='pt-2 text-red-700'>
                {msg}
            </Text>
        }
        <TouchableOpacity
        onPress={optionSaveHandler}
        className='py-6'>
            <Text
            className='text-center text-xl'>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
    )
}

const PlaceOptionInputs =({addOptions, setIsInputShown}:
    {addOptions:Dispatch<SetStateAction<PlaceOption[]>>,setIsInputShown:Dispatch<SetStateAction<boolean>>})=>{

  const optionSaveHandler=(place:PlaceOption)=>{
    if(!place) return
    addOptions(prev=>[...prev, place])
    setIsInputShown(false)
  }

    return(
        <View
        className='w-[90%] mx-auto'
        style={{
            overflow:'visible',
            zIndex:999
        }}>
            <GoogleTextInput onSaveHandler={optionSaveHandler} type='poll'/>
        </View>

    )
}


const OptionLists =<T extends PollQuestion>({type,title, setQuestionDisable, setError}:{
    type:PollQuestion,
    title:string,
    setQuestionDisable:Dispatch<SetStateAction<boolean>>
    setError:Dispatch<SetStateAction<string>>
})=>{
    type OptionLists = T extends "date" ?Date :PlaceOption
    const {setToggleEventRender} = useMyEventStore()
    const [isInputShown, setIsInputShown] = useState<boolean>(false)
    const [options, setOptions] = useState<OptionLists[]>([])

    // request backend to create a poll with options
    const createPollHandler = async()=>{
        if(options.length<=1 && !title){
            return
        }
        console.log(options)
        try{
            //POST request

            //clear the options
            setOptions([])

            // toggle Event Render to triger rendering page
            setToggleEventRender()
        }catch(error){
            setError(error as string)
        }

    }

    useEffect(()=>{
        if(options.length!==0){
            setQuestionDisable(true)
        }else{
            setQuestionDisable(false)
        }
    },[options])

    return (
        <View
        className='flex flex-col gap-4'
        style={{overflow:'visible', zIndex:999}}>
            {options.length>0&&(
                options.map((option,i)=>(
                    <View
                    className='px-4 flex flex-row items-center justify-between py-4 gap-4 bg-[#FAFAF9] border border-[#E2DDD8] rounded-lg'
                    key={`date-option-${i}`}> 
                        {/* radio use touchable opacity for radio buttom */}
                        <View
                        style={{
                            borderStyle:"solid",
                            borderColor:"#848484"
                        }}
                        className='w-[18px] aspect-square rounded-full border'/>
                        <View/>
                        {type==="date"?
                        <Text
                        className='text-[1.2rem] w-[150px] font-Lexend'>
                            {formatDateTime(option as Date)}
                        </Text>:
                        <View>
                            <View
                            className='font-Lexend w-[150px]'>
                            <Text
                            className='font-Lexend text-[1.2rem] mb-1'>
                                {(option as PlaceOption).placeNeme.split(",")[0]}    
                            </Text>
                            {/* <Text
                            className='font-LexendLight text-md'
                            >
                            {(option as PlaceOption).placeNeme.split(",").slice(1,-1).join(",").trim()}
                            </Text> */}
                            </View>
                            {(option as PlaceOption).url&&
                            <Link
                            className='font-Lexend text-gray-400'
                            href={(option as PlaceOption).url as any}>
                                See More
                            </Link>}
                        </View>}

                        {/* remove btn */}
                        <TouchableOpacity
                        onPress={()=>{
                            setOptions(prev=>prev.filter(p=>p!==option))
                        }}>
                            <Text
                            className='text-red-800 font-Lexend'>Remove</Text>
                        </TouchableOpacity>
                            
                        
                    </View>
                ))
            )}
            {/* If isInputShow true, then show option input, if not show add option button if the options are less than 3*/}
            {isInputShown?(
                type==="date"?
                <DateOptionInputs
                    setIsInputShown={setIsInputShown}
                    addOptions={setOptions as Dispatch<SetStateAction<Date[]>>}
                    />:
                <PlaceOptionInputs
                  setIsInputShown={setIsInputShown}
                  addOptions={setOptions as Dispatch<SetStateAction<PlaceOption[]>>}/>
                ):
                options.length<3&&(
                <TouchableOpacity
                onPress={()=>setIsInputShown(true)}>
                    <View
                    className='flex flex-row items-center gap-3'>
                        <Entypo name="plus" size={20} color="#D4541A" />
                        <Text
                        className='text-[#D4541A] text-[16px] font-LexendMedium'>
                            Add option</Text>
                    </View>
                </TouchableOpacity>)
            }
            {
                options.length>0&&(
                    <TouchableOpacity
                    disabled={options.length<=1}
                    onPress={createPollHandler}
                    className='bg-[#FF7600] py-3 rounded-lg mt-4'>
                        <Text
                        className='text-white font-LexendSemiBold text-center text-2xl'>
                            Create Poll
                        </Text>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

const PollForm = () => {
    const [pollQuestion, setPollQuestion] = useState<PollQuestion|null>(null)
    const [questionDisable, setQuestionDisable] = useState<boolean>(false)
    const [question, setQuestion] = useState<string>("")
    const [error, setError] = useState<string>("")

    const defaultText={
            date:"What time should we meet?",
            place:"Where should we meet?"
        }

    useEffect(()=>{
        setQuestion(pollQuestion==="date"?defaultText.date:pollQuestion==="place"?defaultText.place:"")
    },[pollQuestion])
    
    
    return (
        <View
        className='px-8 py-6 font-Lexend'>
            <View
            style={{
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                borderRadius:20
            }}
            className='py-6 px-4'>
            <Accordion.Accordion>
                    <Accordion.Header>
                        <View
                        className='flex flex-row justify-between'>
                        <Text
                        className='font-MontserratSemiBold text-2xl'>Create Poll</Text>
                        <Accordion.HeaderIcon>
                            <Entypo name="chevron-thin-down" size={24} color="black" />
                        </Accordion.HeaderIcon>
                        </View>
                    </Accordion.Header>

            <Accordion.Expanded>
                <View
                className='border-t-[#B0AAA5] py-6'>
                    {/* poll question */}
                    <View
                    className='pb-6'>
                        <Text
                        className='text-lg pb-6 font-LexendSemiBold text-[#6B6560]'>
                            POLL QUESTION
                        </Text>

                        <View
                        className='border-2 border-[#E2DDD8] rounded-2xl'>
                            <TouchableOpacity
                            disabled={questionDisable}
                            onPress={()=>setPollQuestion("date")}
                            className={`border-b-2 border-[#E2DDD8] ${pollQuestion==="date"?'bg-[rgba(9,37,104,0.5)]': "bg-[#FAFAF9]"} rounded-t-2xl`}>
                                <Text
                                className={`${pollQuestion==="date"?'text-white':'text-[#B0AAA5]'} font-Lexend`}
                                style={styles.questionBox}>Date</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            disabled={questionDisable}
                            onPress={()=>setPollQuestion("place")}
                            className={` ${pollQuestion==="place"?'bg-[rgba(9,37,104,0.5)]':'bg-[#FAFAF9]'} rounded-b-2xl`}>
                                <Text
                                className={`${pollQuestion==="place"?'text-white':'text-[#B0AAA5]'} font-Lexend`}
                                style={styles.questionBox}>Place</Text>
                            </TouchableOpacity>
                        </View>

                        {/* question text input - showing if date or place has been chosen*/}
                        {pollQuestion!==null&&
                        <View
                        className='mt-8 flex flex-row gap-2'
                        style={styles.borderBox}>
                            <Ionicons name="chatbubble-outline" size={20} color="#747688" />
                            <TextInput
                            value={question}
                            placeholderTextColor="#ACACAC"
                            onChangeText={setQuestion}
                            style={styles.textInput}
                            />
                        </View>}
                    </View>

                    {/* poll options */}
                    <View>
                        <Text
                        className='text-lg pb-6 font-LexendSemiBold text-[#6B6560]'>
                            POLL OPTIONS (MAX 3 OPTIONS)
                        </Text>

                        {pollQuestion==="date"?
                        <OptionLists 
                        type='date'
                        title={question}
                        setQuestionDisable={setQuestionDisable}
                        setError={setError}
                        />:
                        pollQuestion==="place"&&
                        <OptionLists 
                        type='place'
                        title={question}
                        setQuestionDisable={setQuestionDisable}
                        setError={setError}
                        />
                        }
                    </View>

                    {/* Error */}
                    {error&&
                    <View>
                        <Text>{error}</Text>
                    </View>}
                </View>
            </Accordion.Expanded>
            </Accordion.Accordion>
            </View>
        </View>

  )
}

export default PollForm


const styles = StyleSheet.create({
    questionBox:{
        fontSize: 22,
        lineHeight: 32,
        paddingVertical:12,
        paddingHorizontal:24
    },
    borderBox:{
        borderStyle:'solid',
        borderRadius:10,
        borderColor:'rgba(130,130,130,0.7)',
        borderWidth:2,
        paddingHorizontal:15,
        paddingVertical:15,
    },
    textInput:{
        fontSize:18,
        fontFamily:"Lexend",
        color:'#747688'
    },
})