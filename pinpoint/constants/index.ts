import activity from '@/assets/images/details-page/activity.png';
import birthday from '@/assets/images/details-page/birthday.png';
import cafe from '@/assets/images/details-page/cafe.png';
import defaultImg from '@/assets/images/details-page/defalutImg.png';
import dinner from '@/assets/images/details-page/dinner.png';
import lunch from '@/assets/images/details-page/lunch.png'

export const getGoogleImgUrl = (key:string)=>{
    const apiKey= process.env.EXPO_PUBLIC_GOOGLE_API_KEY!
    const imgUrl='https://maps.googleapis.com/maps/api/place/photo?'

    return `${imgUrl}photo_reference=${key}&maxwidth=500&key=${apiKey}`
}

export const images ={
activity,
birthday,
cafe,
defaultImg,
dinner,
lunch
}