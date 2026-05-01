export const formatDateTime =( date:Date)=>{
    if(!date) return 
    const dateString = date.toString()
    const dateArr = dateString.split(" ")
    
    const wod = dateArr[0]
    const month = dateArr[1]
    const day = dateArr[2]
    const year = dateArr[3]
    const hour = dateArr[4].split(":")[0]
    const mins = dateArr[4].split(":")[1]

    return `${(Number(hour)&&Number(hour)>=12)?`${Number(hour)-12}:${mins} PM `:`${hour}:${mins} AM`} ${month} ${day}, ${year} (${wod})`
}

export const formatDate = (date:Date) =>{
    if(!date) return 
    const dateString = date.toString()
    const dateArr = dateString.split(" ")
    
    const wod = dateArr[0]
    const month = dateArr[1]
    const day = dateArr[2]
    const year = dateArr[3]

    return `${month} ${day}, ${year} (${wod})`
}

export const formatTime = (date:Date)=>{
    if(!date) return 
    const dateString = date.toString()
    const dateArr = dateString.split(" ")
    
    const hour = dateArr[4].split(":")[0]
    const mins = dateArr[4].split(":")[1]

    return `${(Number(hour)&&Number(hour)>=12)?`${Number(hour)-12}:${mins} PM `:`${hour}:${mins} AM`}`
}