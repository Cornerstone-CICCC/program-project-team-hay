import { PollOption } from '@/app/(root)/event/[id]'
import { useEventStore } from '@/store/event.store'
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

type Result={
    poll_option:PollOption,
    voteCount: number
}

const ActivePoll = ({poll,memberLen}:{poll:Props,memberLen:number}) => {
    // const { userId} = useUserStore()
    const [selectedItem, setSelectedItem] = useState<string| null>(null)
    const [resultShown, setResultShown] = useState<boolean>(false)
    const [resutls, setResults] = useState<Result[]|null>(null)


    useEffect(()=>{
        let userId="user-1"
        let myAnswer = false
        let resultArr:Result[]=[]
        poll.options.forEach(op=>{
            if(op.votes){
                const find = op.votes.find(vote=> vote.userId===userId)
                if(find){
                    const res = {
                        poll_option:op,
                        voteCount: op.votes.length
                    }
                    resultArr.push(res)
                    
                    myAnswer= true
                }
            }
        })

        // if user has been answered before, show results
        if(myAnswer){
            const sortResultArr = resultArr.sort((a,b)=> b.voteCount-a.voteCount)
            setResults(sortResultArr)
            setResultShown(true)
        }
    },[])

    const handleSubmit =async()=>{
        //Sending api request to update vote 

        //fetch the results

        //dummy data
        const newResults:Result[]= poll.options.map((o,i)=>({
             poll_option:o,
             voteCount:1+i,
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
                    {!resultShown?
                    <>
                        <View
                        className='flex flex-col gap-6'>
                        {poll.options.map(op=>(
                            <View
                            key={`options-${op.option_id}`}
                            className='flex flex-row gap-6 items-center'>
                                {/* Radio */}
                                {selectedItem&&selectedItem===op.label?(
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
                                        setSelectedItem(op.label)
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
                                       {poll.type==="date"?`${op.label.split("T")[0]} ${op.label.split("T")[1]}`:
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
                    </>:resutls?
                    <ResultPoll
                    poll_id={poll.id}
                    type={poll.type}
                    memberLen={memberLen}
                    results={resutls}
                    />:
                    <Text>
                        Error
                    </Text>
                    }

                </View>
            </View>
        </View>
  )
}


type ResultProps={
    poll_id:string,
    results:Result[]
    type:string,
    memberLen:number
}

const ResultPoll = (props:ResultProps)=>{
    const {id} = useLocalSearchParams()
    const {setToggleEventRender} = useEventStore()
    const [sortedResult, setSortedResult]= useState<Result[]>([])
    const [ total, setTotal] = useState<number>(0)
    const [isTie, setIsTie] = useState(false)
    

    useEffect(()=>{

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

        // triggger to update active poll
        setToggleEventRender()
    }

    // update and close poll
    const handleUpdate = async()=>{
        const event_id=id
        const winner = sortedResult[0]
        const type = props.type
        let updates;
        
        if(type === "date"){
            updates ={
                date:new Date(winner.poll_option.label)
            } 
        }if( type==="place"){
            updates={
                place_name:winner.poll_option.label,
                address:winner.poll_option.address,
                latitude:winner.poll_option.latitude,
                longitude:winner.poll_option.longitude,
                url: winner.poll_option.url?? null,
                imgKey:winner.poll_option.imgKey?? null
            }
        }

        // request to update event


        // close poll
        await handleClosePoll()

    }

    // show alert to user if user want to proceed update or not
    const showAlert=()=>{
        Alert.alert(
            'Warning',
            `${props.memberLen -total} member${props.memberLen -total!==1?"s have ":" has"} not voted yet.\n Do you want to update and close this poll?`,
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

    
    
    return (
        <View>
            {sortedResult.map(r=>(
                <View
                key={`result-op-${r.poll_option.option_id}`}
                className='flex flex-row justify-between px-10 py-2'>
                    <Text
                    className='text-[18px] font-Lexend'>
                        {props.type==="date"?`${r.poll_option.label.split("T")[0]} ${r.poll_option.label.split("T")[1]}`:
                        `${r.poll_option.label}`
                        }
                    </Text>

                    <Text
                    className='text-[18px] font-Lexend'>
                        {r.voteCount} / {props.memberLen}
                    </Text>
                </View>
            ))}

            {
            total === props.memberLen && (
                <TouchableOpacity onPress={isTie ? handleClosePoll : handleUpdate}>
                    <Text>{isTie ? "Close Poll" : "Update and Close Poll"}</Text>
                </TouchableOpacity>
            )}
            {/* 60% of members voted, then show update and close poll with warning */}
            {total/ props.memberLen >= 0.6&&(
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