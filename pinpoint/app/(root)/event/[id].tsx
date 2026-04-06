import ActivePoll, { Result } from "@/components/event-detail/ActivePoll";
import DetailCard from "@/components/event-detail/DetailCard";
import PlaceCard from "@/components/event-detail/PlaceCard";

import PollForm from "@/components/event-detail/PollForm";
import TrackPreview from "@/components/event-detail/TrackPreview";
import { images } from "@/constants";
import { fetchEventBgImage } from "@/libs/eventImgHandler";
import { useMyEventStore } from "@/store/event.store";
import { useAuthStore } from "@/store/functions/auth.store";
import { useEventStore } from "@/store/functions/event.store";
import { useLocationStore } from "@/store/functions/location.store";
import { useMyLocationStore } from "@/store/location.store";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Member } from "../members/[id]";

// Disirable returning type for event
export interface EventDetail {
  id: string;
  name: string;
  date?: string;
  place?: {
    place_name: string;
    address: string;
    latitude: number;
    longitude: number;
    url?: string;
    imgKey?: string;
  };
  members: Member[];
  activePoll?: ActivePoll[];
}
export interface ActivePoll {
  id: string;
  title: string;
  is_active: boolean;
  type: "date" | "place";
  options: PollOption[];
}
export interface PollOption {
  option_id: string;
  label: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  url?: string;
  imgKey?: string;
  votes?: Vote[];
}

export interface Vote {
  id: string;
  option_id: string;
  userId: string;
}

// export const event: EventDetail = {
//   id: "28",
//   name: "Coffee Meetup",
//   date: "2026-03-23T10:00",
//   place: {
//     place_name: "Startbucks Coffee Company",
//     address: "West Pender Street, Vancouver, BC, Canada",
//     latitude: 49.28463,
//     longitude: -123.1151,
//     url: "https://maps.google.com/?cid=1502409917068404389",
//     imgKey:
//       "ATCDNfVapP_-XKGN0BYKcnl9NhZMg9WgA0RmeHFqX1zlnr-HVeOTZ-Aw8AijXxpnUXIEVmruHq5QH3NUkpAkeGtCiSHvkw1_vsxYFWCdsEM-2Cq6fFGa3jL-ybRal_Ov2QhfqXUrWx-rlUoJ1u2Q2p3VRZCZuh45rLUNXB-VSQS4bXYcHHkbgKzVfuKoLqtseNT3LWwEUxj7qjU4R83qi0Iwxg1udk_Qr1lJo76_Y7gXi4Ub8Tnqw728alXwm79vxGlEjtseQL_Pd1c3Y2YqHXPXsNwoTbYD3ata0OJW2SYnYyJyZM9L9E3ieJh1owZZJU3dQn8nwZLcOasSRHfi2qCzwBChinx3eEkVMtKq71c7cNvQdCWeeK0gQr3Njhdt33Ddrtj4grIZJm-3AMsR9jqSWygGVDNIU7fou9vGehVwpHJNQw",
//   },
//   members: [
//     {
//       userId: "user-1",
//       name: "Emma Watson",
//       // image: "/avatars/emma.jpg",
//     },
//     {
//       userId: "user-2",
//       name: "Chris Evans",
//       // image: "/avatars/chris.jpg",
//     },
//     {
//       userId: "user-3",
//       name: "Tom Holland",
//       // image: "/avatars/tom.jpg",
//     },
//   ],
//   activePoll: [
//     {
//       id: "123",
//       title: "What time we should meet?",
//       type: "date",
//       is_active: true,
//       options: [
//         {
//           option_id: "1",
//           label: "2026-03-14T15:00",
//           votes: [
//             {
//               id: "22",
//               option_id: "1",
//               userId: "user-1",
//             },
//             {
//               id: "24",
//               option_id: "1",
//               userId: "user-2",
//             },
//           ],
//         },
//         {
//           option_id: "2",
//           label: "2026-03-14T18:00",
//         },
//       ],
//     },
//   ],
// };

const EventDetail = () => {
  const { user } = useAuthStore();
  const { toggleEventRender } = useMyEventStore();
  const { id } = useLocalSearchParams();
  const { setUserLocation } = useMyLocationStore();
  const {setShowPollResult, setPollResult} = useMyEventStore()
  const [bgImg, setBgImg] = useState(images.defaultImg);
  const [hasPermission, setHasPermission] = useState(false);
  const [eventDetail, setEventDetail] = useState<null | EventDetail>();
  const [isLoading, setIsLoading] = useState(true)

  const {createMyLocationRowForEvent} = useLocationStore()
  const {fetchEventById}= useEventStore()

  //fetching data
  useEffect(() => {
    console.log(user);
    if(!id ||!user) return
    //Fetching event detail from id
    const fetchEventDetail = async()=>{
      const eventDetail = await fetchEventById(id as string)

      if(!eventDetail){
        console.log("There is no event detail with this id")
        return
      }
      
      // check if the user has been voted for active poll and set results 
      if(eventDetail.activePoll){
        let results:Result[] =[]
        eventDetail.activePoll[0].options.map(op=>{
          results.push({
            poll_option_id:op.option_id,
            label:op.label,
            voteCount:op.votes?.length??0
          })
          op.votes?.map(v=>{
            if(v.userId === user.id){
              console.log("you voted")
              setShowPollResult(true)
            }
          })
        })
        setPollResult(results)
      }

      setEventDetail({
        id:eventDetail.id,
        name:eventDetail.name,
        place:eventDetail.place,
        date:eventDetail.date,
        members:eventDetail.members.map(mem=>({
          userId:mem.id,
          name:mem.name,
          image:mem.image
        })),
        activePoll:eventDetail.activePoll
      });
  
      const bgImage = fetchEventBgImage(eventDetail.name);
      setBgImg(bgImage);
      setIsLoading(false)
    }

    fetchEventDetail()
  }, [id, toggleEventRender]);

  useEffect(() => {

    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync();
 
      // check if user has user location for this event
      const result = createMyLocationRowForEvent({
        event_id:id as string,
        latitude: location.coords.latitude,
        longitude:location.coords.longitude
      })
      
      if(!result){
        console.log("error creating location row")
        return
      }

      console.log(result)

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    requestLocation();
  }, []);

  if(isLoading){
    return(
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#FF7600" />
      </SafeAreaView>
    </SafeAreaProvider>
    )
  }

  if (!eventDetail) {
    return (
      <View className="font-Lexend p-10">
        <View className="absolute top-[4rem] flex flex-row justify-between items-center w-full px-4 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <Text className="justify-self-center text-3xl font-LexendBold">
            Hangout Details
          </Text>
          <View></View>
        </View>
        <View
        className="pt-16">
          <Text
          className="text-center">
            Nothing To Show
          </Text>
        </View>
    </View>
    );
  }

  return (
    <View className="font-Lexend pb-16">
      <FlatList
        data={[]}
        renderItem={null}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 15 }}
        ListHeaderComponent={
          <View>
            {/* Hero Image */}
            <View className="relative">
              <Image
                source={bgImg}
                className="w-full h-[250px] opacity-80"
                resizeMode="cover"
              />
              <View className="absolute top-[4rem] flex flex-row justify-between items-center w-full px-4 py-3">
                <TouchableOpacity onPress={() => router.back()}>
                  <AntDesign name="arrow-left" size={30} color="black" />
                </TouchableOpacity>
                <Text className="justify-self-center text-3xl font-LexendBold">
                  Hangout Details
                </Text>
                <View></View>
              </View>
            </View>
            <DetailCard event={eventDetail} />
            {/* If the current date time is passed the event date -> not showing active poll and poll form */}
            {eventDetail.activePoll &&
              eventDetail.date &&
              !(new Date(eventDetail.date) < new Date()) &&
              eventDetail.activePoll.map((p) => (
                <ActivePoll
                  key={`active_poll_${p.id}`}
                  poll={p}
                  memberLen={eventDetail.members.length}
                />
              ))}
            {!(eventDetail.date && new Date() > new Date(eventDetail.date)) && ( // if current date is over, then not show the poll Form
              <PollForm id={id as string} />
            )}
            <PlaceCard place={eventDetail.place} />
            <TrackPreview event={eventDetail} />
          </View>
        }
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default EventDetail;