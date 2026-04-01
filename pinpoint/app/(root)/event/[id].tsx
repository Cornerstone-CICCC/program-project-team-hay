import ActivePoll from "@/components/event-detail/ActivePoll";
import DetailCard from "@/components/event-detail/DetailCard";
import PlaceCard from "@/components/event-detail/PlaceCard";

import PollForm from "@/components/event-detail/PollForm";
import TrackPreview from "@/components/event-detail/TrackPreview";
import { images } from "@/constants";
import { fetchEventBgImage } from "@/libs/eventImgHandler";
import { useEventStore } from "@/store/event.store";
import { useLocationStore } from "@/store/location.store";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Member } from "../members/[id]";
import { useAuthStore } from "@/store/functions/auth.store";

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

export const event: EventDetail = {
  id: "28",
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
  members: [
    {
      userId: "user-1",
      name: "Emma Watson",
      // image: "/avatars/emma.jpg",
    },
    {
      userId: "user-2",
      name: "Chris Evans",
      // image: "/avatars/chris.jpg",
    },
    {
      userId: "user-3",
      name: "Tom Holland",
      // image: "/avatars/tom.jpg",
    },
  ],
  activePoll: [
    {
      id: "123",
      title: "What time we should meet?",
      type: "date",
      is_active: true,
      options: [
        {
          option_id: "1",
          label: "2026-03-14T15:00",
          votes: [
            {
              id: "22",
              option_id: "1",
              userId: "user-1",
            },
            {
              id: "24",
              option_id: "1",
              userId: "user-2",
            },
          ],
        },
        {
          option_id: "2",
          label: "2026-03-14T18:00",
        },
      ],
    },
  ],
};

const EventDetail = () => {
  const { user } = useAuthStore();
  const { toggleEventRender } = useEventStore();
  const { id } = useLocalSearchParams();
  const { setUserLocation } = useLocationStore();
  const [bgImg, setBgImg] = useState(images.defaultImg);
  const [hasPermission, setHasPermission] = useState(false);
  const [eventDetail, setEventDetail] = useState<null | EventDetail>();

  //fetching data
  useEffect(() => {
    console.log(user);
    //Fetching event detail from id

    setEventDetail(event);
    const bgImage = fetchEventBgImage(event.name);
    setBgImg(bgImage);
  }, [id, toggleEventRender]);

  useEffect(() => {
    // check if user has user location for this event

    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync();

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    requestLocation();
  }, []);

  if (!eventDetail) {
    return <Text>Nothing to show</Text>;
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
                  memberLen={event.members.length}
                />
              ))}
            {!(eventDetail.date && new Date() > new Date(eventDetail.date)) && ( // if current date is over, then not show the poll Form
              <PollForm />
            )}
            <PlaceCard place={eventDetail.place} />
            <TrackPreview event={eventDetail} />
          </View>
        }
      />
    </View>
  );
};

export default EventDetail;
