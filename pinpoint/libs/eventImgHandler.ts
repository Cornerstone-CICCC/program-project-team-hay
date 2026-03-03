import { images } from "@/constants"

const cafe = ['coffee','sweet','cake','cafe','dessert', 'afternoon','latte','tea']
const activity = ['fun','activity','sports','run','play', 'walk','camp','mountain','trail','park']
const birthday = ['year','birthday','celebrate','wedding','congrats','graduation', 'happy','party']
const dinner = ['dinner','night','restaurant','drink','chill']
const lunch = ['lunch','brunch','noon','food','morning']

export const fetchEventBgImage = (eventName:string) =>{
    const lowerName = eventName.toLowerCase()
    const keywords = lowerName.split(" ")

    for(const k of keywords){

        if(cafe.includes(k)){

            return images.cafe
        }else if(activity.includes(k)){
            return images.activity
        }else if(birthday.includes(k)){
            return images.birthday
        }else if(dinner.includes(k)){
            return images.dinner
        }else if(lunch.includes(k)){
            return images.lunch
        }
        return images.defaultImg
    }
    return images.defaultImg
}