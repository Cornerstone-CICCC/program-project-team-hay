import { sampleImg } from '@/constants'
import { calculateRegion, generateMarkersFromData } from '@/libs/map'
import { useLocationStore } from '@/store/location.store'
import AntDesign from '@expo/vector-icons/AntDesign'
import * as Location from 'expo-location'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { EventDetail } from '../event/[id]'

export interface MarkerData{
    latitude: number,
    longitude: number,
    id?: string,
    userId:string,
    name:string
    image:string
}

const TrackingMAP = () => {
    const {id} = useLocalSearchParams()
    const {setUserLocation,userLatitude, userLongitude}= useLocationStore()
    const [event, setEvent] = useState<EventDetail|null>(null)
    const [routeInfo, setRouteInfo] = useState<{ duration: number; distance: number } | null>(null);
    const [markers, setMarkers] = useState<MarkerData[]>([])
    const [selectedMember, setSelectedMember] = useState<MarkerData|null>(null)
    const [region, setRegion] = useState<{
        latitude:number,
        longitude:number,
        latitudeDelta: number,
        longitudeDelta: number
    }>({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    })

    if(Platform.OS==="web"){
        return router.back()
    }

    const fetchMembersLocation = async()=>{

    }



    //Geting destination latitude and logitude and set it to place and initial region
    //Setting markers on map 
    useEffect(()=>{

        if(!id||!event || !event.members ||!userLatitude || !userLongitude) return

        const initialRegion = calculateRegion({
            userLatitude,
            userLongitude,
            destinationLatitude: event.place.latitude,
            destinationLongitude: event.place.longitude
        })

        setRegion(initialRegion)
        const newMembers = generateMarkersFromData({ //need to use fetchmember location later
            data:event.members,
            userLatitude,
            userLongitude
        })
        setMarkers(newMembers)

    },[id, event?.members, userLatitude, userLongitude])

    //fetching all people's location every 30s
    useEffect(()=>{
        const requestLocation = async()=>{
            let {status} = await Location.requestForegroundPermissionsAsync()
            if(status!=='granted'){
            return
            }
    
            let location =await Location.getCurrentPositionAsync()
            setUserLocation({
            latitude:location.coords.latitude,
            longitude:location.coords.longitude,
            })
    
        }
        
        
        requestLocation()

        setEvent(
            {
        id: "1",
        name: "Coffee Meetup",
        date: "2026-03-14T16:00",
        place:{
            place_name: "Startbucks Coffee Company",
            address: "West Pender Street, Vancouver, BC, Canada",
            latitude:49.28463,
            longitude:-123.1151,
            url:"https://maps.google.com/?cid=1502409917068404389",
            imgKey:'ATCDNfVapP_-XKGN0BYKcnl9NhZMg9WgA0RmeHFqX1zlnr-HVeOTZ-Aw8AijXxpnUXIEVmruHq5QH3NUkpAkeGtCiSHvkw1_vsxYFWCdsEM-2Cq6fFGa3jL-ybRal_Ov2QhfqXUrWx-rlUoJ1u2Q2p3VRZCZuh45rLUNXB-VSQS4bXYcHHkbgKzVfuKoLqtseNT3LWwEUxj7qjU4R83qi0Iwxg1udk_Qr1lJo76_Y7gXi4Ub8Tnqw728alXwm79vxGlEjtseQL_Pd1c3Y2YqHXPXsNwoTbYD3ata0OJW2SYnYyJyZM9L9E3ieJh1owZZJU3dQn8nwZLcOasSRHfi2qCzwBChinx3eEkVMtKq71c7cNvQdCWeeK0gQr3Njhdt33Ddrtj4grIZJm-3AMsR9jqSWygGVDNIU7fou9vGehVwpHJNQw'
        },
        members: [
            {
            id: "user-1",
            name: "Emma Watson",
            image: "/avatars/emma.jpg",
            },
            {
            id: "user-2",
            name: "Chris Evans",
            image: "/avatars/chris.jpg",
            },
            {
            id: "user-3",
            name: "Tom Holland",
            image: "/avatars/tom.jpg",
            },
        ],
        activePoll:[{
            id:"123",
            title:"What time we should meet?",
            type:"date",
            is_active:true,
            options:[
            {
                option_id:"1",
                label:"2026-03-14T15:00",
            },
            {
                option_id:"2",
                label:"2026-03-14T18:00",
            },
            ]
        }]
        }
        )
        const interval = setInterval(()=>{

        })
    },[])

    useEffect(()=>{
        let subscriber: Location.LocationSubscription

        const startTracking = async()=>{
            subscriber = await Location.watchPositionAsync(
                {
                    timeInterval:3000,
                    distanceInterval:10
                },
                (location)=>{
                    setUserLocation({
                        latitude:location.coords.latitude,
                        longitude:location.coords.longitude
                    })
                }
            )
        }

        startTracking()
        return ()=>subscriber?.remove()
    },[])


  return (
    <View
    className='relative w-full'>
        <View
        className='absolute z-20 w-full flex flex-row justify-between items-center px-4 pt-20 pb-3 bg-[rgba(266,266,266,0.7)]'>
            <TouchableOpacity
            onPress={()=> router.back()}>
            <AntDesign 
            name="arrow-left"
                size={30} 
                color="black" />
            </TouchableOpacity>

            <TouchableOpacity
            className='bg-[#FF7600] rounded-md'>
                <Text
                className='text-white text-[18px] font-LexendSemiBold px-4 py-2'>Stop Tracking</Text>
            </TouchableOpacity>
        </View>
        <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={styles.map}
        className='w-full h-full rounded-2xl'
        tintColor='black'
        mapType='standard'
        showsPointsOfInterest={false}
        initialRegion={region}
        showsUserLocation={true}
        userInterfaceStyle='light'
        >
            {/* Members markers */}
        {markers.map(marker=>(
            <Marker
            key={`marker-${marker.userId}`}
            coordinate={{
            latitude:marker.latitude,
            longitude:marker.longitude
            }}
            title={marker.name}
            onPress={()=>setSelectedMember(marker)}
            anchor={{ x: 0.5, y: 1 }} 
            >
            <View style={styles.markerContainer}>
                {/* Avatar bubble */}
                <View style={styles.avatarRing}>
                    <Image
                    source={sampleImg.user}
                    style={styles.avatarImage}
                    />
                </View>
                {/* Teardrop pointer */}
                <View style={styles.markerPointer} />
            </View>

            </Marker>
        ))}
        {
            event&&event.place.latitude&&event.place.longitude&&(
            <>
            <Marker
            key="destination"
            coordinate={{
                latitude:event.place.latitude,
                longitude:event.place.longitude
            }}
            title='destination'
            />

            {/* direction line */}
            {selectedMember&&
            <MapViewDirections
            origin={{
                latitude:selectedMember.latitude,
                longitude:selectedMember.longitude
            }}
            destination={{
                latitude:event.place.latitude,
                longitude:event.place.longitude
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
            strokeColor='#0286ff'
            strokeWidth={4}
            mode="TRANSIT"
            onReady={(result) => {
            setRouteInfo({
                duration: Math.ceil(result.duration),   
                distance: result.distance,              
            });
            }}
            onError={(err) => console.warn('Directions error:', err)}
            />}
            </>
            )
        }
        {routeInfo && (
            <View style={styles.etaBox}>
                <View>
                    <Text style={styles.etaTime}>{routeInfo.duration} min</Text>
                    <Text style={styles.etaDist}>{routeInfo.distance.toFixed(1)} km</Text>
                </View>

                <TouchableOpacity>
                    <Text>Message</Text>
                </TouchableOpacity>

            </View>
            )}
        </MapView>
    </View>
  )
}

export default TrackingMAP

const AVATAR_SIZE = 48;

const styles = StyleSheet.create({
    map:{
        width:'100%',
        height:'100%'
    },
    markerContainer: {
    alignItems: 'center',
    },
    avatarRing: {
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    // Shadow (Android)
    elevation: 8,
    backgroundColor: '#fff',
    },
    avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    },
    markerPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
    marginTop: -1,      // tuck flush under the ring
    // drop shadow on the pointer too
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    },
    etaBox: {
        position: 'absolute',
        bottom: 24,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    etaTime: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0286ff',
    },
    etaDist: {
        fontSize: 15,
        fontWeight: '500',
        color: '#666',
    },
})