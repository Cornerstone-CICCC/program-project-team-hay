import { PollOption } from '@/app/(root)/event/[id]'
import { Link } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props={
    id:string,
    title:string,
    is_active:boolean,
    type:"date" |"place"
    options:PollOption[]
}


const ActivePoll = ({poll,memberLen}:{poll:Props,memberLen:number}) => {
    const [selectedItem, setSelectedItem] = useState<string| null>(null)
    const [resultShown, setResultShown] = useState<boolean>(false)
    const [resutls, setResults] = useState<Result[]|null>(null)

    // useEffect(()=>{
    //     console.log(selectedItem)
    // },[selectedItem])

    const handleSubmit =async()=>{
        //Sending api request to update vote 

        //fetch the results

        //dummy data
        const newResults:Result[]= poll.options.map((o,i)=>({
             poll_option_id:o.option_id,
             label:o.label,
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
                            className='text-[20px] font-LexendSemiBold text-[#6B6560]'>
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

type Result={
    poll_option_id:string,
    label:string,
    voteCount: number
}

type ResultProps={
    results:Result[]
    type:string,
    memberLen:number
}

const ResultPoll = (props:ResultProps)=>{
    const [sortedResult, setSortedResult]= useState<Result[]>([])

    useEffect(()=>{
        const sorted = props.results.sort((a,b)=>b.voteCount-a.voteCount)
        setSortedResult(sorted)
    },[])
    
    
    return (
        <View>
            {sortedResult.map(r=>(
                <View
                key={`result-op-${r.poll_option_id}`}
                className='flex flex-row justify-between px-10 py-2'>
                    <Text
                    className='text-[18px] font-Lexend'>
                        {props.type==="date"?`${r.label.split("T")[0]} ${r.label.split("T")[1]}`:
                        `${r.label}`
                        }
                    </Text>

                    <Text
                    className='text-[18px] font-Lexend'>
                        {r.voteCount} / {props.memberLen}
                    </Text>
                </View>
            ))}


        </View>
    )

}

export default ActivePoll

const styles = StyleSheet.create({})