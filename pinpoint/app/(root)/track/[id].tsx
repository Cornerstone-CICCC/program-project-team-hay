import { defalutImage } from "@/constants";
import { useIsTrackAvailable } from "@/hooks/useIsTrackAvailable";
import { calculateRegion } from "@/libs/map";
import { useMyLocationStore } from "@/store/location.store";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

export interface MarkerData {
  latitude: number;
  longitude: number;
  id?: string;
  userId: string;
  name: string;
  image: string;
  friend_id?: string;
}

export interface TrackEventDetail {
  id: string; //event id
  name: string;
  date: string;
  place: {
    place_name: string;
    address: string;
    latitude: number;
    longitude: number;
    url?: string;
    imgKey?: string;
  };
}

const TrackingMAP = () => {
  const { id } = useLocalSearchParams();
  const { setUserLocation, userLatitude, userLongitude } = useMyLocationStore();
  const [event, setEvent] = useState<TrackEventDetail | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    duration: number;
    distance: number;
  } | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const isTrackAvailable = useIsTrackAvailable(event?.date ?? null);
  const [selectedMember, setSelectedMember] = useState<MarkerData | null>(null);
  const [available, setAvailable] = useState(false);

  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  if (Platform.OS === "web") {
    return router.back();
  }

  const fetchMembersLocation = async () => {
    // set Markers
    // setMarkers()
  };

  //Geting destination latitude and logitude and set it to place and initial region
  //Setting markers on map
  useEffect(() => {
    // make sure the user allow us to locate
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };
    requestLocation();

    if (!id || !userLatitude || !userLongitude) return;

    // Fetch event data with location

    const data = {
      id: "1",
      name: "Coffee Meetup",
      date: "2026-03-23T10:00",
      place: {
        place_name: "Startbucks Coffee Company",
        address: "West Pender Street, Vancouver, BC, Canada",
        latitude: 49.28463,
        longitude: -123.1151,
        url: "https://maps.google.com/?cid=1502409917068404389",
        imgKey:
          "ATCDNfVapP_-XKGN0BYKcnl9NhZMg9WgA0RmeHFqX1zlnr-HVeOTZ-Aw8AijXxpnUXIEVmruHq5QH3NUkpAkeGtCiSHvkw1_vsxYFWCdsEM-2Cq6fFGa3jL-ybRal_Ov2QhfqXUrWx-rlUoJ1u2Q2p3VRZCZuh45rLUNXB-VSQS4bXYcHHkbgKzVfuKoLqtseNT3LWwEUxj7qjU4R83qi0Iwxg1udk_Qr1lJo76_Y7gXi4Ub8Tnqw728alXwm79vxGlEjtseQL_Pd1c3Y2YqHXPXsNwoTbYD3ata0OJW2SYnYyJyZM9L9E3ieJh1owZZJU3dQn8nwZLcOasSRHfi2qCzwBChinx3eEkVMtKq71c7cNvQdCWeeK0gQr3Njhdt33Ddrtj4grIZJm-3AMsR9jqSWygGVDNIU7fou9vGehVwpHJNQw",
      },
    };

    // // check if the time is track available if not redirect back
    // const isTrackAvailable = useIsTrackAvailable(data.date)
    if (!isTrackAvailable) {
      console.log("Cannot track right now");
    } else {
      setAvailable(true);
    }

    // fetch location and set to setEvent
    setEvent(data);

    // calculate initial Region for map
    const initialRegion = calculateRegion({
      userLatitude,
      userLongitude,
      destinationLatitude: data.place.latitude,
      destinationLongitude: data.place.longitude,
    });

    setRegion(initialRegion);

    // updating my location to backend

    // const newMembers = generateMarkersFromData({ //need to use fetchmember location later
    //     data:event.members,
    //     userLatitude,
    //     userLongitude
    // })
    // setMarkers(newMembers)
  }, [id, userLatitude, userLongitude, isTrackAvailable]);

  //fetching all people's location every 30s after isTrackavailable until everyone arrives or user close
  useEffect(() => {
    if (!event || !available) return;

    let subscriber: Location.LocationSubscription;
    let interval: number;

    //start
    const startTrackingMe = async () => {
      subscriber = await Location.watchPositionAsync(
        {
          timeInterval: 3000,
          distanceInterval: 10,
        },
        (location) => {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        },
      );
    };

    const startTrackingOthers = () => {
      fetchMembersLocation();
      interval = setInterval(fetchMembersLocation, 30000);
    };

    startTrackingMe();
    startTrackingOthers();

    return () => {
      subscriber?.remove();
      clearInterval(interval);
    };
  }, [isTrackAvailable, event, available]);

  const handleMessage = async () => {
    // if selected member does not have friend_id
    if (!selectedMember?.friend_id) {
      // create friend by sending userId and friend_userId
    } else {
      router.push(`/chat/${selectedMember.friend_id}` as any);
    }
  };

  return (
    <View className="relative w-full">
      <View className="absolute z-20 w-full flex flex-row justify-between items-center px-4 pt-20 pb-3 bg-[rgba(266,266,266,0.7)]">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={30} color="black" />
        </TouchableOpacity>

        {isTrackAvailable && (
          <TouchableOpacity
            className="bg-[#FF7600] rounded-md"
            onPress={() => setAvailable((prev) => !prev)}
          >
            <Text className="text-white text-[18px] font-LexendSemiBold px-4 py-2">
              {available ? "Stop Tracking" : "Resume Tracking"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!available && (
        <View className="absolute top-0 w-full h-full bg-black/70 z-10">
          <Text
            style={{
              color: "white",
              textAlign: "center",
              top: "50%",
              fontSize: 20,
            }}
          >
            Tracking Pause
          </Text>
        </View>
      )}
      <MapView
        provider={
          Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        style={styles.map}
        className="w-full h-full rounded-2xl"
        tintColor="black"
        mapType="standard"
        showsPointsOfInterest={false}
        initialRegion={region}
        showsUserLocation={true}
        userInterfaceStyle="light"
      >
        {/* Members markers */}
        {markers.map((marker) => (
          <Marker
            key={`marker-${marker.userId}`}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.name}
            onPress={() => setSelectedMember(marker)}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.markerContainer}>
              {/* Avatar bubble */}
              <View style={styles.avatarRing}>
                <Image
                  source={
                    marker.image ? { uri: marker.image } : defalutImage.user
                  }
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>
              {/* Teardrop pointer */}
              <View style={styles.markerPointer} />
            </View>
          </Marker>
        ))}
        {event && event.place.latitude && event.place.longitude && (
          <>
            <Marker
              key="destination"
              coordinate={{
                latitude: event.place.latitude,
                longitude: event.place.longitude,
              }}
              title="destination"
            />

            {/* direction line */}
            {selectedMember && (
              <MapViewDirections
                origin={{
                  latitude: selectedMember.latitude,
                  longitude: selectedMember.longitude,
                }}
                destination={{
                  latitude: event.place.latitude,
                  longitude: event.place.longitude,
                }}
                apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
                strokeColor="#0286ff"
                strokeWidth={4}
                mode="TRANSIT"
                onReady={(result) => {
                  setRouteInfo({
                    duration: Math.ceil(result.duration),
                    distance: result.distance,
                  });
                }}
                onError={(err) => console.warn("Directions error:", err)}
              />
            )}
          </>
        )}
        {routeInfo && (
          <View style={styles.etaBox}>
            <View>
              <Text style={styles.etaTime}>{routeInfo.duration} min</Text>
              <Text style={styles.etaDist}>
                {routeInfo.distance.toFixed(1)} km
              </Text>
            </View>

            <TouchableOpacity onPress={handleMessage}>
              <Text>Message</Text>
            </TouchableOpacity>
          </View>
        )}
      </MapView>
    </View>
  );
};

export default TrackingMAP;

const AVATAR_SIZE = 48;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    alignItems: "center",
  },
  avatarRing: {
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    // Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    // Shadow (Android)
    elevation: 8,
    backgroundColor: "#fff",
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
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFFFFF",
    marginTop: -1, // tuck flush under the ring
    // drop shadow on the pointer too
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  etaBox: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  etaTime: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0286ff",
  },
  etaDist: {
    fontSize: 15,
    fontWeight: "500",
    color: "#666",
  },
});
