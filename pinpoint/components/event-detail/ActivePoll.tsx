import { PollOption } from '@/app/(root)/event/[id]'
import { Member } from '@/app/(root)/members/[id]'
import { formatDate, formatDateTime, formatTime } from '@/libs/format'
import { useMyEventStore } from '@/store/event.store'
import { useAuthStore } from '@/store/functions/auth.store'
import { useEventStore } from '@/store/functions/event.store'
import { usePollStore } from '@/store/functions/poll.store'
import { useVoteStore } from '@/store/functions/vote.store'
import { Link, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props={
    id:string,
    title:string,
    is_active:boolean,
    type:"date" |"place"
    options:PollOption[]
}

export type Result={
    poll_option_id:string,
    label:string,
    address?:string,
    latitude?:number,
    longitude?:number,
    imgKey?:string,
    url?:string,
    voteCount: number
}

const ActivePoll = ({poll,members}:{poll:Props,members:Member[]}) => {
    const [selectedItem, setSelectedItem] = useState<string| null>(null)
    const [resultShown, setResultShown] = useState<boolean>(false)
    const [resutls, setResults] = useState<Result[]|null>(null)
    const {createVoteForOption} = useVoteStore()
    const {showPollResult,datePollResult,placePollResult}= useMyEventStore()
    const {user} = useAuthStore()

    // If user has been voted showPollResult should be true
    // useEffect(()=>{
    //     setResultShown(showPollResult)
    //     if(showPollResult){

    //         setResults(poll.type==="date"?datePollResult:placePollResult)
    //     }
    // },[showPollResult])

    useEffect(()=>{
        console.log("recived poll", poll)

        let userHasVoted = false
        const computed = poll.options
        .filter(p=>p.votes)
        .map(p=>({
            poll_option_id:p.option_id,
            label:p.label,
            address:p.address,
            latitude:p.latitude,
            longitude:p.longitude,
            imgKey:p.imgKey,
            url:p.url,
            voteCount:p.votes!.length
        }))

        for (const p of poll.options){
            if(!p.votes) continue
            for(const v of p.votes){
                if(v.userId===user?.id){
                    userHasVoted = true
                    break
                }
            }
            if(userHasVoted) break
        }

        if(userHasVoted){
            setResults(computed.sort((a,b)=>a.voteCount-b.voteCount))
            setResultShown(true)
        }else{
            setResults(null)
            setResultShown(false)
        }

    }, [user, poll, members])

    useEffect(()=>{
        console.log("result", resutls)
        console.log("resultShown", resultShown)
    },[resutls, resultShown])

    const handleSubmit =async()=>{
        if(!selectedItem) return
        //Sending api request to update vote 
        const res = await createVoteForOption(selectedItem, poll.id)

        console.log(res)

        if(!res){
            console.log("null response")
            return
        }

        // setting result
        const newResults= res.map((o)=>({
             poll_option_id:o.poll_option_id,
             label:o.label,
             voteCount:o.voteCount,
        }))

        //set it to resutls
        setResults(newResults)
        //add
        
        setResultShown(true)
    }

  
    return (
        <View
        className='px-8 py-6 font-Lexend'>
            <View
            style={{
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                borderRadius:20
            }}
            className='py-6 px-4'>
                        <View
                        className='flex flex-row justify-between'>
                        <Text
                        className='font-MontserratSemiBold text-2xl'>
                            Active Poll
                        </Text>
                        </View>

                <View
                className='border-t-[#B0AAA5] py-6 px-4'>
                    {/* poll question */}
                    <View
                    className='pb-6'>
                        <View>
                            <Text
                            className='text-[18px] font-LexendSemiBold text-[#6B6560]'>
                                {poll.title}
                            </Text>
                        </View>
                    </View>

                    {/* poll options */}
                    {!resultShown&&
                    <>
                        <View
                        className='flex flex-col gap-6'>
                        {poll.options.map(op=>(
                            <View
                            key={`options-${op.option_id}`}
                            className='flex flex-row gap-4 items-center'>
                                {/* Radio */}
                                {selectedItem&&selectedItem===op.option_id?(
                                <TouchableOpacity
                                onPress={()=>setSelectedItem(null)}>
                                    <View
                                    style={{
                                        borderStyle:"solid",
                                        borderColor:"grey"
                                    }}
                                    className='w-[18px] aspect-square rounded-full border border-[#848484] flex items-center justify-center'>
                                        <View
                                        className='w-[12px] aspect-square rounded-full bg-[#848484]'
                                        />
                                    </View>
                                </TouchableOpacity>):
                                    (<TouchableOpacity
                                    onPress={()=>{
                                        setSelectedItem(op.option_id)
                                    }}
                                    >
                                    <View
                                    style={{
                                        borderStyle:"solid",
                                        borderColor:"grey"
                                    }}
                                    className='w-[18px] aspect-square rounded-full border'></View>
                                </TouchableOpacity>
                            )}

                                <View>
                                    <Text
                                    className='text-[18px] font-Lexend'>
                                       {poll.type==="date"?`${formatDateTime(new Date(op.label))}`:
                                       `${op.label}`
                                       }
                                    </Text>
                                    {poll.type==="place"&&op.url&&
                                    <Link
                                    href={op.url as any}>
                                    <Text>See more</Text>
                                    </Link>
                                    }
                                </View>
                            </View>
                        ))}
                        </View>

                        <TouchableOpacity
                        disabled={!selectedItem?true:false}
                        onPress={handleSubmit}
                        className='bg-[#FF7600] py-3 rounded-lg mt-6'
                        >
                            <Text
                            className='text-white font-LexendSemiBold text-center text-2xl'>
                                Submit
                            </Text>
                       </TouchableOpacity>
                    </>}
                    {resutls&&
                    <ResultPoll
                    poll_id={poll.id}
                    type={poll.type}
                    members={members}
                    results={resutls}
                    />}
                    {/* // :
                     <Text>
                        Error
                     </Text>
                     */}

                </View>
            </View>
        </View>
  )
}


type ResultProps={
    poll_id:string,
    results:Result[]
    type:string,
    members:Member[]
}

const ResultPoll = (props:ResultProps)=>{
    const {id} = useLocalSearchParams()
    const {setToggleEventRender} = useMyEventStore()
    const [sortedResult, setSortedResult]= useState<Result[]>([])
    const [ total, setTotal] = useState<number>(0)
    const [isTie, setIsTie] = useState(false)
    const [memberLen, setMemberLen] = useState<number>(0) 

    const {updateEventById} = useEventStore()
    const {updatePollById} = usePollStore()
    

    useEffect(()=>{

        if(!props) return
        setMemberLen(props.members.length)

        const sorted = props.results.sort((a,b)=>b.voteCount-a.voteCount)

        // count total number of votes
        const count = sorted.reduce((sum,curr)=>sum+=curr.voteCount,0)

        setTotal(count)
        setSortedResult(sorted)

        if(sorted.length>1&&sorted[0].voteCount === sorted[1].voteCount){
            setIsTie(true)
        }
    },[])

    // Change is_active in poll row
    const handleClosePoll =async()=>{

        // update backend 
        await updatePollById(props.poll_id)

        // triggger to update active poll
        setToggleEventRender()
    }

    // update event and close poll 
    const handleUpdate = async()=>{
        const eventId=id as string
        const winner = sortedResult[0]
        const winner_option_id = winner.poll_option_id
        const type = props.type
        let updates;

        // need to fetch poll_option detail by option id
        
        if(type === "date"){
            updates ={
                date:new Date(winner.label),
                members:props.members
            } 
        }if( type==="place"){
            updates={
                place_name:winner.label,
                address:winner.address,
                latitude:winner.latitude,
                longitude:winner.longitude,
                url: winner.url,
                imgKey:winner.imgKey,
                members:props.members
            }
        }

        if(!updates){
            console.log("nothing to update")
            return
        }

        // request to update event
        const res = updateEventById(eventId,updates )
        console.log("Event update by poll", res)

        // close poll
        await handleClosePoll()

    }

    // show alert to user if user want to proceed update or not
    const showAlert=()=>{
        Alert.alert(
            'Warning',
            `${memberLen -total} member${memberLen -total!==1?"s have ":" has"} not voted yet.\n Do you want to update and close this poll?`,
            [
                {
                    text:'Cancel',
                    onPress:()=>console.log("cancel pressed"),
                    style:'cancel'
                },
                {
                    text:"Update",
                    onPress:()=> {
                        console.log("Proceed to update")
                        handleUpdate()
                    },
                }
            ]
        )
    }

    const dateOutput=(label:string)=>(
        <View>
            <Text className='text-[16px] font-Lexend'>
                {formatDate(new Date(label))}
            </Text>
            <Text className='font-LexendLight'>
                {formatTime(new Date(label))}
            </Text>
        </View>
    )

    const placeOutput=(res:Result)=>(
        <View className='w-[220px]'>
            <Text className='text-[16px] font-Lexend'>
                {res.label}
            </Text>
            {res.address&&<Text
            className='font-LexendLight'>{res.address.split(',')[0]}</Text>}
        </View>

    )

    
    
    return (
        <View>
            {sortedResult.map(r=>(
                <View
                key={`result-op-${r.poll_option_id}`}
                className='flex flex-row justify-between px-2 py-2'>

                {props.type==="date"?dateOutput(r.label):placeOutput(r)}
                    <Text
                    className='text-[18px] font-Lexend'>
                        {r.voteCount} / {memberLen}
                    </Text>
                </View>
            ))}

            {
            total === memberLen && (
                <TouchableOpacity 
                className='pt-12 w-fit mx-auto'
                onPress={isTie ? handleClosePoll : handleUpdate}>
                    <Text
                    className='text-lg font-LexendSemiBold text-white py-2 px-4 bg-[#FF7600] rounded-lg'>
                        {isTie ? "Close Poll" : "Update and Close Poll"}</Text>
                </TouchableOpacity>
            )}
            {/* 60% of members voted, then show update and close poll with warning */}
            {(total/ memberLen >= 0.6&&total !== memberLen)&&(
                <TouchableOpacity
                className='pt-12 w-fit mx-auto'
                onPress={showAlert}>
                    <Text
                    className='text-lg font-LexendSemiBold text-white py-2 px-4 bg-[#FF7600] rounded-lg'>
                        Update and Close Poll
                    </Text>
                </TouchableOpacity>
            )}

        </View>
    )

}

export default ActivePoll

const styles = StyleSheet.create({})