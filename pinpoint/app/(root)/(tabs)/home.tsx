import CurrentFriendCard from "@/components/CurrentFriendCard";
import HangoutCard from "@/components/HangoutCard";
import { useAuthStore } from "@/store/functions/auth.store";
import { useHomeStore } from "@/store/functions/home.store";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface EventOverview {
  event_id: string;
  name: string;
  date?: string;
  address?: string;
}
interface Friend {
  friend_id: string;
  friend_userId: string;
  friend_image: string;
  friend_name: string;
}

const Home = () => {
  const user = useAuthStore(s => s.user);
  const home = useHomeStore();
  
  const userId = user?.id;

  const [hangoutList, setHangoutList] = useState<EventOverview[] | null>([]);
  const [recentFriendList, setRecentFriendList] = useState<Friend[] | null>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const hangouts = await home.getHomeEventList();
      const friends = await home.getRecentFriends();
      setHangoutList(hangouts);
      setRecentFriendList(friends);
    };
    fetchData();
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.ttl}>{user?.name}</Text>
      <Text style={styles.subttl}>Your upcoming Hangouts</Text>
      <View style={styles.cardList}>
        {!hangoutList || hangoutList.length === 0 ? (
          <View style={styles.noCardItem}>
            <Text style={styles.noCardTxt}>No hangouts yet</Text>
          </View>
        ) : (
          hangoutList.map((item) => (
            // <HangoutCard key={item.event_id} data={item} />
            <HangoutCard key={item.event_id} data={{
              ...item,
              status: 'confirmed',
            }} />
          ))
        )}
      </View>
      <Text style={styles.subttl}>Current contacted friends</Text>
      <View style={styles.friendList}>
        {!recentFriendList || recentFriendList.length === 0 ? (
          <Text style={styles.noFriend}>No recent contacts</Text>
        ) : (
          recentFriendList.map((item) => (
            <CurrentFriendCard key={item.friend_id} data={item} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 76,
    backgroundColor: "#fff",
  },
  ttl: {
    fontFamily: "Montserrat-Bold",
    color: "#FF7600",
    fontSize: 35,
    marginBottom: 32,
  },
  subttl: {
    fontFamily: "Montserrat-Bold",
    color: "#333",
    fontSize: 24,
    marginBottom: 20,
  },
  cardList: {
    marginBottom: 50,
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
  friendList: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 210,
  },
  noFriend: {
    fontFamily: "Lexend-Regular",
    fontSize: 16,
    color: "#7c7c7c",
    paddingBlock: 10,
  },
});
