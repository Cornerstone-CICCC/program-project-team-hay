import CurrentFriendCard from "@/components/CurrentFriendCard"
import HangoutCard from "@/components/HangoutCard"
import { HomeFriends } from "@/dummy/HomeFriends"
import { HomeHangouts } from "@/dummy/HomeHangouts"
import { useAuthStore } from "@/store/auth.store"
import { useEffect, useState } from "react"
import { ImageSourcePropType, ScrollView, StyleSheet, Text, View } from "react-native"

interface EventOverview {
  event_id: string,
  name: string,
  date?: string,
  address?: string,
}
interface Friend {
  dm_id: string,
  friend_userId: string,
  friend_image: string | ImageSourcePropType,
  friend_name: string
}

const Home = () => {
  const { user } = useAuthStore()
  const userId = user?.id

  //
  const USE_DUMMY = true
  //
  const [hangoutList, setHangoutList] = useState<EventOverview[]>([])
  const [recentFriendList, setRecentFriendList] = useState<Friend[]>([])
  
  useEffect(() => {
    if(!userId) return;

    const fetchData = async () => {
      //
      if(USE_DUMMY){
        setHangoutList(HomeHangouts)
        setRecentFriendList(HomeFriends)
        return
      }
      //
      const hangouts = await getHomeEventList(userId)
      const friends = await getRecentFriends(userId)
      setHangoutList(hangouts)
      setRecentFriendList(friends)
    }
    fetchData()
  }, [userId])

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.ttl}>{user?.name}</Text>
      <Text style={styles.subttl}>Your near future Hangout</Text>
      <View style={styles.cardList}>
        {hangoutList.length === 0 ? (
          <View style={styles.noCardItem}>
            <Text style={styles.noCardTxt}>No hangouts yet</Text>
          </View>
        ) : (
          hangoutList.map((item) => (
            <HangoutCard key={item.event_id} data={item} />
          ))
        )
      }
      </View>
      <Text style={styles.subttl}>Current contacted friends</Text>
      <View style={styles.friendList}>
        {recentFriendList.length === 0 ? (
          <Text style={styles.noFriend}>No recent contacts</Text>
        ) : (
          recentFriendList.map((item) => (
            <CurrentFriendCard key={item.dm_id} data={item} />
          ))
        )}
      </View>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 76,
    backgroundColor: '#fff'
  },
  ttl: {
    fontFamily: 'Montserrat-Bold',
    color: '#FF7600',
    fontSize: 35,
    marginBottom: 32,
  },
  subttl: {
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    fontSize: 24,
    marginBottom: 20,
  },
  cardList: {
    marginBottom: 50,
  },
  noCardItem: {
    borderRadius: 18,
    padding: 14,
    boxShadow: '5px 10px 20px #3333334c',
    overflow: 'hidden',
    marginBottom: 20,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCardTxt: {
    fontFamily: 'Lexend-Regular',
    fontSize: 16,
    color: '#7c7c7c',
  },
  friendList: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 210,
  },
  noFriend: {
    fontFamily: 'Lexend-Regular',
    fontSize: 16,
    color: '#7c7c7c',
    paddingBlock: 10,
  }
})