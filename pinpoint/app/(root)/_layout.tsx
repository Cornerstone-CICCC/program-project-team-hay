import { useMyLocationStore } from "@/store/location.store";
import * as Location from "expo-location";
import { Stack } from "expo-router";
import { useEffect } from "react";
export default function Layout() {
    const { setUserLocation} = useMyLocationStore();

    // start being tracked me
      useEffect(()=>{
          let subscriber: Location.LocationSubscription
  
          //start
          const startTrackingMe = async()=>{
            const {status} = await Location.requestForegroundPermissionsAsync()
            if(status !== 'granted') return
              subscriber = await Location.watchPositionAsync(
                  {
                      timeInterval:5000,
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
  
          startTrackingMe()
  
          return ()=>{
              subscriber?.remove()
          }
      },[])
  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}