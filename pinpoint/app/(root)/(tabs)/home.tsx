import CurrentFriendCard from "@/components/CurrentFriendCard"
import HangoutCard from "@/components/HangoutCard"
import { ScrollView, StyleSheet, Text, View } from "react-native"

const Home = () => {
  const hangoutList = [
    { id: 'a1', name: 'Hangout ttl01', date_time: '2026-03-06 18:00', image: require('../../../assets/images/dummy01.png'), place_name: '', address: '36 Guild Street London, USA' },
    { id: 'a2', name: 'Hangout ttl02', date_time: '2026-03-18 09:00', image: require('../../../assets/images/dummy01.png'), place_name: '', address: '37 Guild Street London, USA' },
    { id: 'a3', name: 'Hangout ttl03', date_time: '2026-03-29 12:00', image: require('../../../assets/images/dummy01.png'), place_name: '', address: '38 Guild Street London, USA' },
  ]
  const currentFriendList = [
    { id: 'a101', name: 'John', image: require('../../../assets/images/dummy02.png') },
    { id: 'a102', name: 'Harry', image: require('../../../assets/images/dummy02.png') },
    { id: 'a103', name: 'Ron', image: require('../../../assets/images/dummy02.png') },
  ]

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.ttl}>Username</Text>
      <Text style={styles.subttl}>Your near future Hangout</Text>
      <View style={styles.cardList}>
        {hangoutList.map((item) => (
          <HangoutCard key={item.id} data={item} />
        ))}
      </View>
      <Text style={styles.subttl}>Current contacted friends</Text>
      <View style={styles.friendList}>
        {currentFriendList.map((item) => (
          <CurrentFriendCard key={item.id} data={item} />
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