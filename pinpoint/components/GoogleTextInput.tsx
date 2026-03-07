import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { PlaceOption } from "./event-detail/PollForm";
import { Place } from "./shared/EventForm";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!

type Props={
    onSaveHandler?:(place:PlaceOption)=>void,
    setNewLocation?:(place:Place)=>void,
    type?:"new"|"poll"
}
const GoogleTextInput =({onSaveHandler,setNewLocation, type}:
    Props)=>{
    const [placeInfo, setPlaceInfo]=useState<Place|null>(null)


    //TODO:: use locationStore and show result around me


    return (
    <View
    className="mb-15">
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
            language:'en'
        }}
        />
        {type!=="new"&&
        <TouchableOpacity
        className="pt-4"
        onPress={()=>{
            if(!placeInfo?.url ||!onSaveHandler) return
            const place:PlaceOption = {
                placeNeme:placeInfo?.place_name,
                desc:placeInfo?.url
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