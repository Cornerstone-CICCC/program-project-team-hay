import HangoutCard from "@/components/HangoutCard"
import { useRouter } from "expo-router"
import { ImageSourcePropType, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from "react";
import { DummyEvents } from "@/dummy/EventList";

interface EventOverview {
  event_id: string,
  name: string,
  date?: string,
  address?: string,
  image: string | ImageSourcePropType,
}
type EventFilter = 'upcoming' | 'today' | 'tomorrow' | 'week' | 'past'

const Hangout = () => {
  //
  const USE_DUMMY = true
  const userId = 'qwe123'
  //
  const tabs: { label: string, value: EventFilter }[] = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'In a week', value: 'week' },
    { label: 'Past', value: 'past' },
  ]

  const router = useRouter()
  const [keyword, setKeyword] = useState<string>('')
  const [hangoutList, setHangoutList] = useState<EventOverview[]>([])
  const [activeTab, setActiveTab] = useState<EventFilter>('upcoming')
  const [hangoutsByTab, setHangoutsByTab] = useState<Record<EventFilter, EventOverview[]>>({
    upcoming: [],
    today: [],
    tomorrow: [],
    week: [],
    past: []
  })

  const fetchEvents = async (tab: EventFilter) => {
    // console.log(hangoutsByTab)
    if(hangoutsByTab[tab].length > 0){
      setHangoutList(hangoutsByTab[tab])
      return      
    }
    //
    let data: EventOverview[] = []
    if(USE_DUMMY){
      const now = new Date()
      data = DummyEvents.filter(item => {
        if (!item.date) return tab === 'upcoming'
        const d = new Date(item.date)
        switch (tab) {
          case 'today':
            return d.toDateString() === now.toDateString()
          case 'tomorrow':
            const tomorrow = new Date()
            tomorrow.setDate(now.getDate() + 1)
            return d.toDateString() === tomorrow.toDateString()
          case 'week':
            const weekLater = new Date()
            weekLater.setDate(now.getDate() + 6)
            return d >= now && d <= weekLater
          case 'past':
            return d < now
          default:
            return d >= now
        }
      })
    } else {
      data = await getEventList(userId, tab)
    }
    //

    // const data = await getEventList(userId, tab)

    setHangoutsByTab(prev => ({
      ...prev,
      [tab]: data
    }))
    setHangoutList(data)
  }
  
  const handleTabChange = (tab: EventFilter) => {
    setActiveTab(tab)
  }
  useEffect(() => {
    fetchEvents(activeTab)
  }, [activeTab])

  const filteredHangouts = hangoutList.filter(item =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hangoutHead}>
        <Text style={styles.pageTtl}>Hangout Lists</Text>
        <TouchableOpacity onPress={() => router.push('/hangout/create')} style={styles.btnCreate}>
          <Feather name="plus-square" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal>
        <View style={styles.filter}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.value
            return(
              <TouchableOpacity key={tab.value} onPress={() => handleTabChange(tab.value)} style={isActive ? styles.filterItemWrapCurrent : styles.filterItemWrap}>
                <Text style={isActive ? styles.filterItemCurrent : styles.filterItem}>{tab.label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
      <View style={styles.searchWrap}>
        <Feather name="search" size={16} color="#7C7C7C" />
        <TextInput placeholder="Search..." placeholderTextColor='#7C7C7C' value={keyword} onChangeText={setKeyword} style={styles.inputSearch} />
      </View>
      <View style={styles.cardList}>
        {filteredHangouts.map((item) => (
          <HangoutCard key={item.event_id} data={item} />
        ))}
      </View>

      <Text className='mb-100 pb-20' onPress={() => router.push('/hangout/detail/inviteExist')}>detail invite exist</Text>
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
    position: 'relative',
    marginBottom: 30,
    paddingBlock: 14,
  },
  pageTtl: {
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    fontSize: 24,
    textAlign: 'center',
  },
  btnCreate: {
    width: 44,
    height: 44,
    borderRadius: 22,
    boxShadow: '0 4px 8px #3333334c',
    backgroundColor: '#FFA900',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  filter: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 18,
  },
  filterItemWrap: {
    borderRadius: 24,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#7c7c7c',
    paddingBlock: 8,
    paddingInline: 16,
  },
  filterItem: {
    fontFamily: 'Lexend-Medium',
    fontSize: 16,
    color: '#333'
  },
  filterItemWrapCurrent: {
    borderRadius: 24,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#092568',
    backgroundColor: '#092568',
    paddingBlock: 8,
    paddingInline: 16,
  },
  filterItemCurrent: {
    fontFamily: 'Lexend-Medium',
    fontSize: 16,
    color: '#fff'
  },
  cardList: {
    marginBottom: 150,
  },
  searchWrap: {
    backgroundColor: '#F3F3F3',
    borderRadius: 24,
    paddingInline: 12,
    paddingBlock: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 'auto',
    gap: 7,
    flex: 1,
    marginBottom: 30,
  },
  inputSearch: {
    fontFamily: 'Lexend-Regular',
    fontSize: 16,
    width: '100%',
  },
})