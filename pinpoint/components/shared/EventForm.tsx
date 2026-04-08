import { EventDetail } from "@/app/(root)/event/[id]";
import { Member } from "@/app/(root)/members/[id]";
import { defalutImage } from "@/constants";
import { useMyEventStore } from "@/store/event.store";
import { useAuthStore } from "@/store/functions/auth.store";
import { useEventStore } from "@/store/functions/event.store";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GoogleTextInput from "../GoogleTextInput";
import DateTimeInput from "./DateTimeInput";

type Prop = {
  eventDetail?: EventDetail;
};

export interface Place {
  place_name: string;
  address: string;
  latitude: number;
  longitude: number;
  url?: string;
  imgKey?: string;
}

// export interface EventForm{
//     name:string,
//     date:Date,
//     place:Place,
//     members:{
//     id:string,
//     name:string,
//     image:string
//     }[]
// }

// reuse this form for create and edit

const EventForm = (props: Prop) => {
  const { user } = useAuthStore();
  const { members, setMembers, clearSelectedEvent} = useMyEventStore();
  const [eventForm, setEventForm] = useState<Omit<EventDetail, "id">>({
    name: "",
    date: new Date().toString(),
    place: {
      place_name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      url: "",
      imgKey: "",
    },
    members: [], //add user (yourself initially)
  });
  const {createEvent, updateEventById} = useEventStore()

  useEffect(() => {
    // rename props to event
    const event = props.eventDetail;

    if (!user) return;

    // if it is to create a new event
    if (!event) {
      const myself: Member = {
        userId: user.id,
        name: user.name,
        image: user.profileImage,
      };

      if (eventForm.members.length > 0) return;
      setEventForm((prev) => ({
        ...prev,
        members: [...prev.members, myself],
      }));
      // set myself as member
      setMembers([...members, myself]);
      return;
    }

    //if it is edit then, set the form based on the prop and set the member store
    setMembers(event.members);
    setEventForm({
      name: event.name,
      date: event.date ?? new Date().toString(),
      place: event.place ?? undefined,
      members: event.members,
    });
  }, [user]);

  // update members to eventForm
  useEffect(() => {
    console.log("eventForm", eventForm.members);
    console.log("memberStore", members);
    // when the member is one, which is yourself, and store update is done on the above useEffect dep user
    if (members.length > 0) {
      setEventForm((prev) => ({
        ...prev,
        members: [...members],
      }));
    }
  }, [members]);

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    // if (Platform.OS === 'android') setShowDatePicker(false);  // auto-close on Android
    if (event.type === "set" && selected) {
      const updated = eventForm?.date ? new Date(eventForm.date) : new Date();
      updated.setFullYear(selected.getFullYear());
      updated.setMonth(selected.getMonth());
      updated.setDate(selected.getDate());

      setEventForm((prev) => ({
        ...prev,
        date: updated.toString(),
      }));
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (event.type === "set" && selected) {
      const updated = eventForm?.date ? new Date(eventForm.date) : new Date();
      updated.setHours(selected.getHours());
      updated.setMinutes(selected.getMinutes());
      setEventForm((prev) => ({
        ...prev,
        date: updated.toString(),
      }));
    }
  };

  const locationSaveHandler = (place: Place) => {
    if (!place) return;
    setEventForm((prev) => ({
      ...prev,
      place,
    }));
  };

  const submitEventForm = async () => {
    console.log("submit", eventForm);
    if (eventForm.name.trim() === "" 
    // || eventForm.members.length < 2
  ) {
      console.log("Title is not entered or member is not added");
      return;
    }
    console.log("submit", eventForm);

    const res=  await createEvent({
      name:eventForm.name,
      date: eventForm.date?new Date(eventForm.date):undefined,
      place_name:eventForm.place?.place_name?? undefined,
      address: eventForm.place?.address?? undefined,
      latitude:eventForm.place?.latitude?? undefined,
      longitude:eventForm.place?.longitude?? undefined,
      url:eventForm.place?.url?? undefined,
      imgKey:eventForm.place?.imgKey?? undefined,
      members: eventForm.members
    })

    console.log(res)

    //clearing the members
    setMembers([]);
    setEventForm({
      name: "",
      date: new Date().toString(),
      place: {
        place_name: "",
        address: "",
        latitude: 0,
        longitude: 0,
        url: "",
        imgKey: "",
      },
      members: [],
    });
  };

  const updateEvent = async () => {
    console.log("update", eventForm)

    if(!props.eventDetail) return
    const id = props.eventDetail.id
    const updates={
      name:eventForm.name,
      date: eventForm.date? new Date(eventForm.date): undefined,
      place_nane: eventForm.place?.place_name,
      address:eventForm.place?.address,
      latitude:eventForm.place?.latitude,
      longitude:eventForm.place?.longitude,
      url:eventForm.place?.url,
      imgKey:eventForm.place?.imgKey,
      members:eventForm.members
    }
    // update backend
    const res = updateEventById(
      id,
      updates
    )
    if(!res){
      console.log("error updating")
      return
    }
    console.log(res)
    clearSelectedEvent();
  };

  return (
    <View className="pt-12 flex flex-col gap-12">
      <View>
        <Text style={styles.headText}>Title</Text>
        <TextInput
          value={eventForm?.name}
          placeholder="Enter hangout title"
          placeholderTextColor="#ACACAC"
          onChangeText={(text) => {
            setEventForm((prev) => ({
              ...prev,
              name: text,
            }));
          }}
          style={styles.textIput}
        />
      </View>

      {/* Location */}
      <View className="flex flex-col gap-3">
        <Text style={styles.headText}>Location</Text>
        <View style={styles.locationInputBox}>
          <View>
            <EvilIcons
              className="self-start"
              name="location"
              size={26}
              color="#848484"
            />
          </View>
          <View className="w-[80%] pe-4">
            {eventForm.place && eventForm.place.address === "" ? (
              <GoogleTextInput
                type="new"
                setNewLocation={locationSaveHandler}
              />
            ) : (
              <GoogleTextInput
                type="edit"
                place={eventForm.place}
                setNewLocation={locationSaveHandler}
              />
            )}
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.headText}>Time</Text>
        <DateTimeInput
          eventForm={eventForm}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
        />
      </View>
      {/* Friends  */}
      <View>
        <Text style={styles.headText}>Members</Text>
        <View className="flex flex-row gap-4 items-center justify-between px-4">
          {eventForm && eventForm.members.length > 0 && (
            <View className="flex flex-row gap-2">
              {eventForm.members.length > 3
                ? eventForm.members
                    .slice(0, 3)
                    .map((m) => (
                      <Image
                        key={m.userId}
                        style={styles.picStyle}
                        className="w-[70px] aspect-square"
                        source={m.image ? { uri: m.image } : defalutImage.user}
                        resizeMode="cover"
                      />
                    ))
                : eventForm.members.map((m) => (
                    <Image
                      key={m.userId}
                      style={styles.picStyle}
                      className="w-[80px] aspect-square"
                      source={m.image ? { uri: m.image } : defalutImage.user}
                      resizeMode="cover"
                    />
                  ))}
            </View>
          )}
          <TouchableOpacity
            className="pe-6"
            onPress={() => router.push("/hangout/detail/inviteExist" as any)}
          >
            <AntDesign name="plus" size={30} color="#092568" />
          </TouchableOpacity>
        </View>
      </View>

      {props.eventDetail ? (
        <TouchableOpacity
          onPress={updateEvent}
          className="py-4 bg-[#FF7600] rounded-2xl"
        >
          <Text className="text-white text-xl text-center font-LexendMedium">
            Save
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={submitEventForm}
          className="py-4 bg-[#FF7600] rounded-2xl"
        >
          <Text className="text-white text-xl text-center font-LexendMedium">
            Create
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EventForm;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Montserrat",
    fontWeight: "medium",
    fontSize: 23,
    color: "#595959",
    paddingBottom: 15,
  },

  textIput: {
    borderStyle: "solid",
    borderRadius: 10,
    borderColor: "rgba(130,130,130,0.7)",
    borderWidth: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
    fontSize: 18,
  },
  flexColContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  dateTimeInputBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgba(130,130,130,0.7)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  locationInputBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgba(130,130,130,0.7)",
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 2,
    height:60,
    width: "100%",
    marginBottom: 8,
    zIndex: 100,
    overflow: "visible",
  },
  picStyle: {
    width: 70,
    height: 70,
    borderRadius: 9999,
    borderColor: "rgba(130,130,130,0.7)",
    borderWidth: 1,
  },
});
