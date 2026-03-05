import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { PlaceOption } from "./event-detail/PollForm";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!
const GoogleTextInput =({onSaveHandler}:
    {onSaveHandler:(place:PlaceOption)=>void})=>{
    const [placeInfo, setPlaceInfo]=useState<
    {
        name:string,
        latitude:number|null,
        longititude:number|null,
        url:string|null
    }|null>(null)

    //TODO:: use locationStore and show result around me


    return (
    <View
    className="mb-64">
        <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Find a place"
        debounce={200}
        listViewDisplayed="auto"
        keyboardShouldPersistTaps="handled"
        styles={{
            textInputContainer:{
                alignItems:'center',
                justifyContent:'center',
                marginHorizontal:10,
                position:'relative',
                shadowColor:'#d4d4d4'
            },
            textInput:{
                fontSize:16,
                fontWeight:'600',
                marginTop:5,
                width:'100%',
                borderRadius:200
            },
            listView:{
            backgroundColor: 'white',
              borderRadius: 8,
              elevation: 5,   // Android shadow
              shadowColor: '#000',  // iOS shadow
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              zIndex: 999,
            },
            }}
        onPress={(data, details=null)=>{
            console.log("data",data.description)
            console.log("details",details?.geometry.location.lat,details?.geometry.location.lng)
            console.log("website", details?.url)
            console.log("photo", (details as any)?.photos?.[0]?.photo_reference)
            setPlaceInfo({
                name:data.description,
                longititude:Number(details?.geometry.location.lng)??null,
                latitude:Number(details?.geometry.location.lat)?? null,
                url:details?.url?? null
            })
        }}
        query={{
            key:googlePlacesApiKey,
            language:'en'
        }}
        />
        <TouchableOpacity
        className="pt-4"
        onPress={()=>{
            if(!placeInfo?.url) return
            const place:PlaceOption = {
                placeNeme:placeInfo?.name,
                desc:placeInfo?.url
            }

            onSaveHandler(place)
        }}>
            <Text
            className="text-center text-xl font-LexendMedium">
                Save
            </Text>
        </TouchableOpacity>
    </View>
)}

export default GoogleTextInput

const styles = StyleSheet.create({})