import CurrentFriendCard from "@/components/CurrentFriendCard"
import HangoutCard from "@/components/HangoutCard"
import { HomeFriends } from "@/dummy/HomeFriends"
import { HomeHangouts } from "@/dummy/HomeHangouts"
import { useEffect, useState } from "react"
import { ImageSourcePropType, ScrollView, StyleSheet, Text, View } from "react-native"

interface EventOverview {
  event_id: string,
  name: string,
  date?: string,
  address?: string,
  image: string | ImageSourcePropType,
}
interface Friend {
  dm_id: string,
  friend_userId: string,
  friend_image: string | ImageSourcePropType,
  friend_name: string
}

const Home = () => {
  //
  const USE_DUMMY = true
  const userId = 'qwe123'
  //
  const [hangoutList, setHangoutList] = useState<EventOverview[]>([])
  const [recentFriendList, setRecentFriendList] = useState<Friend[]>([])
  
  useEffect(() => {
    const fetchData = async () => {
      //
      if(USE_DUMMY){
        setHangoutList(HomeHangouts)
        setRecentFriendList(HomeFriends)
        return
      }
      //
      const hangouts = await getEventList(userId, 3)
      const friends = await getRecentFriends(userId)
      setHangoutList(hangouts)
      setRecentFriendList(friends)
    }
    fetchData()
  }, [])

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.ttl}>Username</Text>
      <Text style={styles.subttl}>Your near future Hangout</Text>
      <View style={styles.cardList}>
        {hangoutList.map((item) => (
          <HangoutCard key={item.event_id} data={item} />
        ))}
      </View>
      <Text style={styles.subttl}>Current contacted friends</Text>
      <View style={styles.friendList}>
        {recentFriendList.map((item) => (
          <CurrentFriendCard key={item.dm_id} data={item} />
        ))}
      </View>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    paddingInline: 20,
    paddingTop: 80,
    backgroundColor: '#fff'
  },
  ttl: {
    fontFamily: 'Montserrat-Bold',
    color: '#FF7600',
    fontSize: 32,
    marginBottom: 32,
  },
  subttl: {
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    fontSize: 22,
    marginBottom: 18,
  },
  cardList: {
    marginBottom: 50,
  },
  friendList: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 150,
  }
})