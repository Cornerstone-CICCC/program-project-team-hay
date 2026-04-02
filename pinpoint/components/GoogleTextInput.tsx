import { useMyLocationStore } from "@/store/location.store";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { PlaceOption } from "./event-detail/PollForm";
import { Place } from "./shared/EventForm";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!

type Props={
    onSaveHandler?:(place:PlaceOption)=>void,
    setNewLocation?:(place:Place)=>void,
    place?:{
        place_name:string,
        address:string,
        latitude:number,
        longitude:number,
        }
    type?:"new"|"poll"|"edit"
}
const GoogleTextInput =({onSaveHandler,setNewLocation, type, place}:
    Props)=>{
    const {setUserLocation,userLatitude,userLongitude} = useMyLocationStore()
    const [placeInfo, setPlaceInfo]=useState<Place|null>(null)
    const [editLocaton, setEditLocation] = useState<boolean>(false)


    useEffect(()=>{

        if(!place){
            setEditLocation(true)
        }else{
            setEditLocation(false)
        }
    },[place])

    useEffect(() => {
    (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') return
        
        const location = await Location.getCurrentPositionAsync({})
        setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
        })
    })()
    }, [])


    return (
    <View
    className="mb-15">
        {/* Type is not edit */}
        {editLocaton&&
            <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Location"
        debounce={200}
        listViewDisplayed="auto"
        keyboardShouldPersistTaps="handled"
        styles={{
            container:{
                overflow:'visible'
            },
            textInputContainer:{
                alignItems:'center',
                justifyContent:'center',
                width:'100%',
                marginHorizontal:10,
                position:'relative',
                shadowColor:'#d4d4d4'
            },
            textInput:{
                color:'#ACACAC',
                paddingHorizontal:25,
                fontSize:16,
                fontWeight:'600',
                marginTop:5,
                width:'100%',
                borderRadius:10
            },
            listView:{
                ...(type !== "poll" && { position: 'absolute', top: 50, left: 20, width:'100%' }),
            backgroundColor: 'white',
              elevation: 999,   // Android shadow
              shadowColor: '#000',  // iOS shadow
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              zIndex: 1000,
            },
            }}
        onPress={(data, details=null)=>{
            // console.log("data",data.description)
            // console.log("details",details?.geometry.location.lat,details?.geometry.location.lng)
            // console.log("website", details?.url)
            // console.log("photo", (details as any)?.photos?.[0]?.photo_reference)
            const placeArr = data.description.split(",")
            const place ={
                place_name:placeArr[0],
                address:placeArr.slice(1).join(","),
                longitude:Number(details?.geometry.location.lng)??null,
                latitude:Number(details?.geometry.location.lat)?? null,
                url:details?.url,
                imgKey:(details as any)?.photos?.[0]?.photo_reference
            }
            setPlaceInfo(place)
            if(type==="new" && setNewLocation){
                setNewLocation(place)
            }
        }}
        query={{
            key:googlePlacesApiKey,
            language:'en',
            ...(userLatitude&&userLongitude&&{
                location:`${userLatitude}, ${userLongitude}`,
                radius:10000
            })
        }}
        />}
        {
            (type==="edit"&& place)&&(
                !editLocaton&&
                (<TouchableOpacity
                className="py-2 ps-4"
                onPress={()=>setEditLocation(true)}>
                    <Text>
                        {place.place_name}, {place.address}</Text>
                </TouchableOpacity>)
            )       
        }
        {(type!=="new"&&type!=="edit")&&
        <TouchableOpacity
        className="pt-4"
        onPress={()=>{
            if(!placeInfo ||!onSaveHandler) return
            
            const place:PlaceOption = {
                placeNeme:placeInfo.place_name,
                address:placeInfo.address,
                latitude:placeInfo.latitude,
                longitude:placeInfo.longitude,
                imgKey:placeInfo.imgKey?? undefined,
                url:placeInfo.url?? undefined
            }
            onSaveHandler(place)
        }}>
            <Text
            className="text-center text-xl font-LexendMedium">
                Save
            </Text>
        </TouchableOpacity>}
    </View>
)}

export default GoogleTextInput

const styles = StyleSheet.create({})