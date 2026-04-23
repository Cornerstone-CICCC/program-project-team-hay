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

const EventForm = (props: Prop) => {
  const { user } = useAuthStore();
  const { members, setMembers, clearSelectedEvent } = useMyEventStore();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isTimeTBD, setIsTimeTBD] = useState<boolean>(false)
  const [isPlaceTBD, setIsPlaceTBD] = useState<boolean>(true)
  const [error, setError] = useState<{
    title: string;
    date: string;
    member: string;
  }>({
    title: "",
    date: "",
    member: "",
  });
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate()+7)
  const [eventForm, setEventForm] = useState<Omit<EventDetail, "id">>({
    name: "",
    date: nextWeek.toString(),
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
  const { createEvent, updateEventById } = useEventStore();
  const {setToggleEventRender} = useMyEventStore()

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
      let find: Member | undefined;
      let memberList: Member[] = [];
      setEventForm((prev) => {
        find = prev.members.find((m) => m.userId === myself.userId);
        memberList = find ? prev.members : [...prev.members, myself];
        return {
          ...prev,
          members: memberList,
        };
      });
      // set myself as member
      setMembers(memberList);
      return;
    }

    //if it is edit then, set the form based on the prop and set the member store
    if(!event.date) setIsTimeTBD(true)
    setMembers(event.members);
    setEventForm({
      name: event.name,
      date: event.date ?? new Date().toString(),
      place: event.place ?? undefined,
      members: event.members,
    });
  }, [user]);

  useEffect(()=>{
    const place = eventForm.place
    if(place&&place.address!==""&& place.place_name!==""&&place.latitude!==0&&place.longitude!==0){
      setIsPlaceTBD(false)
    }

  },[eventForm])
  // update members to eventForm
  useEffect(() => {
    // when the member is one, which is yourself, and store update is done on the above useEffect dep user
    if (members.length > 0) {
      setEventForm((prev) => ({
        ...prev,
        members: [...members],
      }));

      if (members.length > 1 && members.length <11) {
        setError((prev) => ({
          ...prev,
          member: "",
        }));
      }
    }
  }, [members]);

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    // if (Platform.OS === 'android') setShowDatePicker(false);  // auto-close on Android
    if (event.type === "set" && selected) {
      const updated = eventForm?.date ? new Date(eventForm.date) : new Date();
      updated.setFullYear(selected.getFullYear());
      updated.setMonth(selected.getMonth());
      updated.setDate(selected.getDate());

      // if(selected<new Date()){
      //   setError("Hangout date needs to be date after today")
      //   return
      // }
      // setError("")

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
    console.log("location 1", place)
    if (!place) return;
    console.log("location save",place);
    setEventForm((prev) => ({
      ...prev,
      place,
    }));
  };

  const submitEventForm = async () => {
    const validationErrors = {
      title: eventForm.name.trim() === "" ? "Title cannot be empty" : "",
      date: !isTimeTBD&&eventForm.date && new Date(eventForm.date) < new Date() ? "Cannot create past hangout" : "",
      member: eventForm.members.length < 2 ? "Cannot create hangout for just yourself" :eventForm.members.length >11?"Cannot create hangout for more than 10 people": "",
    };

    const hasErrors = Object.values(validationErrors).some(Boolean);

    setError(validationErrors);

    if (hasErrors) {
      console.log("One of errors triggered");
      return;
    }
    setIsLoading(true)
    console.log("submit", eventForm);

    try{
      const res = await createEvent({
      name: eventForm.name,
      date: eventForm.date ? new Date(eventForm.date) : undefined,
      place_name: eventForm.place?.place_name ?? undefined,
      address: eventForm.place?.address ?? undefined,
      latitude: eventForm.place?.latitude ?? undefined,
      longitude: eventForm.place?.longitude ?? undefined,
      url: eventForm.place?.url ?? undefined,
      imgKey: eventForm.place?.imgKey ?? undefined,
      members: eventForm.members,
    });

    if (!res) {
      console.log("Error creating event");
      return;
    }

    const event_id = res.id;

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
    setIsLoading(false)
    router.push(`/(root)/event/${event_id}`);
    }catch(error){
      console.log(error)
      setIsLoading(false)
    }

  };

  const updateEvent = async () => {
    console.log("update", eventForm);

    if (!props.eventDetail) {
      console.log("no event id found")
      return
    };
    const id = props.eventDetail.id;

    const validationErrors = {
      title: eventForm.name.trim() === "" ? "Title cannot be empty" : "",
      date: !isTimeTBD&&eventForm.date && new Date(eventForm.date) < new Date() ? "Cannot create past hangout" : "",
       member: eventForm.members.length < 2 ? "Cannot create hangout for just yourself" :eventForm.members.length >11?"Cannot create hangout for more than 10 people": "",
    };

    const hasErrors = Object.values(validationErrors).some(Boolean);

    setError(validationErrors);

    if (hasErrors) {
      console.log("One of errors triggered");
      return;
    }
    setIsLoading(true)
    try{
        const updates = {
          name: eventForm.name,
          date: eventForm.date ? new Date(eventForm.date) : null,
          place_name: eventForm.place?.place_name??null,
          address: eventForm.place?.address??null,
          latitude: eventForm.place?.latitude??null,
          longitude: eventForm.place?.longitude??null,
          url: eventForm.place?.url??null,
          imgKey: eventForm.place?.imgKey??null,
          members: eventForm.members,
        };
        console.log("send updates", updates)
        // update backend
        const res = await updateEventById(id, updates);
        if (!res) {
          console.log("error updating");
          return;
        }
        console.log("update response",res);
        setToggleEventRender()
        clearSelectedEvent();
        router.push(`/(root)/event/${id}`);
    }catch(error){
      console.log(error)
      setIsLoading(false)
    }
  };

  return (
    <View className="pt-12 flex flex-col gap-6">
      <View>
        <Text style={styles.headText}>Title<Text className="text-red-500">*</Text></Text>
        <TextInput
          value={eventForm?.name}
          placeholder="Enter hangout title"
          placeholderTextColor="#ACACAC"
          onChangeText={(text) => {
            if (text.trim() !== "") {
              setError((prev) => ({
                ...prev,
                title: "",
              }));
            }
            setEventForm((prev) => ({
              ...prev,
              name: text,
            }));
          }}
          style={styles.textIput}
        />
        <Text
        style={styles.errorText}>
          {error.title}
        </Text>
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
          <View className="w-[80%] pe-2">
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

        <View
        className="flex flex-row gap-2 px-1">
          <TouchableOpacity
        onPress={() => {
            if (isPlaceTBD) {
                setIsPlaceTBD(false);
            } else {
                setIsPlaceTBD(true);
                const undefinedPlace ={
                    place_name:"",
                    address: "",
                    latitude: null,
                    longitude: null,
                    url: undefined,
                    imgKey:  undefined,
                }
                setEventForm(prev => ({ ...prev, place: undefinedPlace }));
            }
        }}
          >
              <View
                  style={{ borderColor: "grey" }}
                  className='w-[18px] aspect-square rounded-full border border-[#848484] flex items-center justify-center'
              >
                  {isPlaceTBD && (
                      <View className='w-[12px] aspect-square rounded-full bg-[#848484]' />
                  )}
              </View>
          </TouchableOpacity>
          <Text>
              Not decided yet
          </Text>
        </View>
      </View>

      <View>
        <Text style={styles.headText}>Time</Text>
        <DateTimeInput
          eventForm={eventForm}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
          isTimeTBD={isTimeTBD}
        />

        <View
        className="flex flex-row gap-2 pt-3 px-1">
          <TouchableOpacity
        onPress={() => {
            if (isTimeTBD) {
                setIsTimeTBD(false);
            } else {
                setIsTimeTBD(true);
                setEventForm(prev => ({ ...prev, date: undefined }));
            }
        }}
          >
              <View
                  style={{ borderColor: "grey" }}
                  className='w-[18px] aspect-square rounded-full border border-[#848484] flex items-center justify-center'
              >
                  {isTimeTBD && (
                      <View className='w-[12px] aspect-square rounded-full bg-[#848484]' />
                  )}
              </View>
          </TouchableOpacity>
          <Text>
              Not decided yet
          </Text>
        </View>

        <Text
        style={styles.errorText}>
          {error.date}
        </Text>
      </View>
      {/* Friends  */}
      <View>
        <View
        style={{paddingBottom:10}}
        className="flex flex-row items-center gap-4">
          <Text style={styles.headText}>Members<Text className="text-red-500">*</Text></Text>
          <Text
          style={styles.subText}>MAX 10 PEOPLE</Text>
        </View>
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

        <Text
        style={styles.errorText}>
          {error.member}
        </Text>
      </View>

      {props.eventDetail ? (
        <TouchableOpacity
          disabled={isLoading}
          onPress={updateEvent}
          className="py-4 bg-[#FF7600] rounded-2xl"
        >
          <Text className="text-white text-xl text-center font-LexendMedium">
            {isLoading?"Saving...":"Save"}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled={isLoading}
          onPress={submitEventForm}
          className="py-4 bg-[#FF7600] rounded-2xl"
        >
          <Text className="text-white text-xl text-center font-LexendMedium">
            {isLoading?"Creating...":"Create"}
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
  },
  subText: {
    fontFamily: "Montserrat",
    fontWeight: "medium",
    fontSize: 14,
    color: "#595959",
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
    paddingHorizontal: 10,
    paddingVertical: 2,
    height: 60,
    width: "100%",
    marginBottom: 5,
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
  errorText:{
    paddingTop:14,
    color:'#b91c1c',
    fontSize:14
  }
});
