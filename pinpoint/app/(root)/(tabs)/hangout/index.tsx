import HangoutCard from "@/components/HangoutCard"
import { useRouter } from "expo-router"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Hangout = () => {
  const router = useRouter()

  const hangoutList = [
    { id: 'a1', name: 'Hangout ttl01', date_time: '2026-03-06 18:00', image: require('../../../../assets/images/dummy01.png'), place_name: '', address: '36 Guild Street London, USA' },
    { id: 'a2', name: 'Hangout ttl02', date_time: '2026-03-18 09:00', image: require('../../../../assets/images/dummy01.png'), place_name: '', address: '37 Guild Street London, USA' },
    { id: 'a3', name: 'Hangout ttl03', date_time: '2026-03-29 12:00', image: require('../../../../assets/images/dummy01.png'), place_name: '', address: '38 Guild Street London, USA' },
    { id: 'a4', name: 'Hangout ttl04', date_time: '2026-03-29 12:00', image: require('../../../../assets/images/dummy01.png'), place_name: '', address: '38 Guild Street London, USA' },
    { id: 'a5', name: 'Hangout ttl05', date_time: '2026-03-29 12:00', image: require('../../../../assets/images/dummy01.png'), place_name: '', address: '38 Guild Street London, USA' },
    { id: 'a6', name: 'Hangout ttl06', date_time: '2026-03-29 12:00', image: require('../../../../assets/images/dummy01.png'), place_name: '', address: '38 Guild Street London, USA' },
    { id: 'a7', name: 'Hangout ttl07', date_time: '2026-03-29 12:00', image: require('../../../../assets/images/dummy01.png'), place_name: '', address: '38 Guild Street London, USA' },
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hangoutHead}>
        <TouchableOpacity style={styles.btnSort}>
          <FontAwesome5 name="calendar-alt" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/hangout/create')} style={styles.btnCreate}>
          <Feather name="plus-square" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.pageTtl}>Hangout Lists</Text>
      <View style={styles.cardList}>
        {hangoutList.map((item) => (
          <HangoutCard key={item.id} data={item} />
        ))}
      </View>
      
      
    </ScrollView>
  )
}

export default Hangout

const styles = StyleSheet.create({
  container: {
    paddingInline: 20,
    paddingTop: 80,
    backgroundColor: '#fff'
  },
  hangoutHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30
  },
  btnSort: {
    padding: 4,
  },
  btnCreate: {
    width: 44,
    height: 44,
    borderRadius: 22,
    boxShadow: '0 4px 8px #3333334c',
    backgroundColor: '#FFA900',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pageTtl: {
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 34,
  },
  cardList: {
    marginBottom: 150,
  },
})