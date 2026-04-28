import HangoutCard from "@/components/HangoutCard";
import { useEventListStore } from "@/store/functions/eventlist.store";
import Feather from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EventOverview {
  event_id: string;
  name: string;
  date?: string;
  address?: string;
  isConfirmed?: boolean;
  status: 'check' | 'missed' | 'confirmed';
}
type EventFilter = 'invited' | "upcoming" | "today" | "tomorrow" | "week" | "past";
type TabState = {
  events: EventOverview[];
  lastCursor: string | null;
}

const Hangout = () => {
  const event = useEventListStore()

  const tabs: { label: string; value: EventFilter }[] = [
    { label: 'Need actions', value: 'invited' },
    { label: "Upcoming", value: "upcoming" },
    { label: "Today", value: "today" },
    { label: "Tomorrow", value: "tomorrow" },
    { label: "In a week", value: "week" },
    { label: "Past", value: "past" },
  ];

  const router = useRouter();
  const [keyword, setKeyword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<EventFilter>("invited");
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hangoutsByTab, setHangoutsByTab] = useState<
    Record<EventFilter, TabState>
  >({
    invited: { events: [], lastCursor: null },
    upcoming: { events: [], lastCursor: null },
    today: { events: [], lastCursor: null },
    tomorrow: { events: [], lastCursor: null },
    week: { events: [], lastCursor: null },
    past: { events: [], lastCursor: null },
  });

  const fetchEvents = async (tab: EventFilter, force = false) => {
    if (!force && hangoutsByTab[tab].events.length > 0) return;
    
    setIsLoading(true)

    const data = await event.getEventList(tab)
    if(!data) {
      setIsLoading(false)
      return
    }

    const sortEvents = data.events.map((e) => {
      const now = dayjs()
      const eventDate = e.date ? dayjs(e.date) : null
      const isConfirmed = tab === 'invited' ? false : true
      let status: 'check' | 'missed' | 'confirmed' = 'check'
      if(isConfirmed){
        status = 'confirmed'
      } else if (eventDate && eventDate.isBefore(now)){
        status = 'missed'
      } else {
        status = 'check'
      }

      return {
        ...e,
        isConfirmed,
        status
      }
    }) 

    setHangoutsByTab((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        // events: data.events,
        events: sortEvents,
        lastCursor: data.lastCursor ?? null,
      },
    }));

    console.log(`🔥data:`,data)
    setIsLoading(false)
  };

  const handleTabChange = (tab: EventFilter) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    const restData = {
      invited: { events: [], lastCursor: null },
      upcoming: { events: [], lastCursor: null },
      today: { events: [], lastCursor: null },
      tomorrow: { events: [], lastCursor: null },
      week: { events: [], lastCursor: null },
      past: { events: [], lastCursor: null },
    }
    setHangoutsByTab(restData)
    fetchEvents(activeTab);
  }, [activeTab]);

  const filteredHangouts = hangoutsByTab[activeTab].events.filter((item) => {
    if(item.status !== 'missed') return true
    if(!item.date) return true
    const eventDate = dayjs(item.date)
    const now = dayjs()
    console.log("🔥🔥", item)
    return now.isBefore(eventDate.add(2, 'day'), 'day')
  })
  .filter((item) => 
    item.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  const loadMoreEvents = async (tab: EventFilter) => {
    console.log("loading")
    if(isLoadingMore) return;

    const tabData = hangoutsByTab[tab]
    if(!tabData.lastCursor) return;

    setIsLoadingMore(true)
    const data = await event.getEventList(tab, tabData.lastCursor)
    if(!data){
      setIsLoadingMore(false)
      return;
    }

    const sortEvents = data.events.map((e) => {
      const now = dayjs()
      const eventDate = e.date ? dayjs(e.date) : null
      const isConfirmed = tab === 'invited' ? false : true
      let status: 'check' | 'missed' | 'confirmed' = 'check'
      if(isConfirmed){
        status = 'confirmed'
      } else if (eventDate && eventDate.isBefore(now, 'day')){
        status = 'missed'
      } else {
        status = 'check'
      }

      return {
        ...e,
        isConfirmed,
        status
      }
    }) 

    setHangoutsByTab(prev => ({
      ...prev,
      [tab]: {
        // events: [...prev[tab].events, ...data.events],
        events: [
          ...prev[tab].events,
          ...sortEvents.filter(
            newItem => !prev[tab].events.some(e => e.event_id === newItem.event_id)
          )
        ],
        lastCursor: data.lastCursor ?? null,
      },
    }))
    setIsLoadingMore(false)
  }

  const loadMoreEventsbyScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
    if(isBottom){
      loadMoreEvents(activeTab)
    }
  }

  return (
    <ScrollView style={styles.container} onScroll={loadMoreEventsbyScroll}>
      <View style={styles.hangoutHead}>
        <Text style={styles.pageTtl}>Hangout Lists</Text>
        <TouchableOpacity
          onPress={() => router.push("/event/create-event")}
          style={styles.btnCreate}
        >
          <Feather name="plus-square" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal>
        <View style={styles.filter}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                onPress={() => handleTabChange(tab.value)}
                style={
                  isActive
                    ? styles.filterItemWrapCurrent
                    : styles.filterItemWrap
                }
              >
                <Text
                  style={
                    isActive ? styles.filterItemCurrent : styles.filterItem
                  }
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.searchWrap}>
        <Feather name="search" size={16} color="#7C7C7C" />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#7C7C7C"
          value={keyword}
          onChangeText={setKeyword}
          style={styles.inputSearch}
        />
      </View>
      <View style={styles.cardList}>
        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#FF7600" />
          </View>
        ) : (
          filteredHangouts.length === 0 ? (
            <View style={styles.noCardItem}>
              <Text style={styles.noCardTxt}>No hangouts yet</Text>
            </View>
          ) : (
            filteredHangouts.map((item) => (
              <HangoutCard key={item.event_id} data={item} />
            ))
          )
        )}
      </View>
    </ScrollView>
  );
};

export default Hangout;

const styles = StyleSheet.create({
  loadingBox: {
    marginTop: 30,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 76,
    backgroundColor: "#fff",
  },
  hangoutHead: {
    position: "relative",
    marginBottom: 30,
    paddingBlock: 14,
  },
  pageTtl: {
    fontFamily: "Montserrat-Bold",
    color: "#333",
    fontSize: 24,
    textAlign: "center",
  },
  btnCreate: {
    width: 44,
    height: 44,
    borderRadius: 22,
    boxShadow: "0 4px 8px #3333334c",
    backgroundColor: "#FFA900",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
  },
  filter: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 18,
  },
  filterItemWrap: {
    borderRadius: 24,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#7c7c7c",
    paddingBlock: 8,
    paddingHorizontal: 16,
  },
  filterItem: {
    fontFamily: "Lexend-Medium",
    fontSize: 16,
    color: "#333",
  },
  filterItemWrapCurrent: {
    borderRadius: 24,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#092568",
    backgroundColor: "#092568",
    paddingBlock: 8,
    paddingHorizontal: 16,
  },
  filterItemCurrent: {
    fontFamily: "Lexend-Medium",
    fontSize: 16,
    color: "#fff",
  },
  cardList: {
    marginBottom: 150,
  },
  noCardItem: {
    borderRadius: 18,
    padding: 14,
    boxShadow: "5px 10px 20px #3333334c",
    overflow: "hidden",
    marginBottom: 20,
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  noCardTxt: {
    fontFamily: "Lexend-Regular",
    fontSize: 16,
    color: "#7c7c7c",
  },
  searchWrap: {
    backgroundColor: "#F3F3F3",
    borderRadius: 24,
    paddingHorizontal: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
    gap: 7,
    flex: 1,
    marginBottom: 30,
  },
  inputSearch: {
    fontFamily: "Lexend-Regular",
    fontSize: 16,
    width: "100%",
    paddingBlock: 12,
  },
});
