import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from "expo-router";
import dayjs from 'dayjs'

type Hangout = {
  event_id: string,
  name: string,
  date?: string,
  image: string | ImageSourcePropType,
  address?: string
}
type Props = {
  data: Hangout
}

const HangoutCard = ({ data }: Props) => {
  const router = useRouter()
  const goToEventDetail = () => {
    router.push(`/event/${data.event_id}`)
  }

  let month = ''
  let dateStr = ''
  let isValidDate = false

  if(data.date){
    const dateObj = dayjs(data.date)
    isValidDate = dateObj.isValid()
    if(isValidDate){
      month = dateObj.format('MMM').toUpperCase()
      dateStr = dateObj.format('D')
    }
  }
  const isValidPlace = !!data.address

  return (
    <TouchableOpacity onPress={goToEventDetail}>
      <View style={styles.cardItem}>
        <View style={styles.cardImgWrap}>
          <Image source={
            typeof data.image === 'string'
            ? { uri: data.image }
            : data.image
          } style={styles.cardImg} resizeMode="cover" />
          <View style={isValidDate ? styles.cardImgTxtWrap : styles.cardImgDateWrap}>
          {isValidDate ? (
            <>
              <Text style={styles.cardImgTxt}>{month}</Text>
              <Text style={styles.cardImgTxt}>{dateStr}</Text>
            </>
          ) : (
            <Text style={styles.cardImgTxt}>Not{"\n"}Scheduled</Text>
          )}
          </View>
        </View>
        <Text style={styles.cardTtl}>{data.name}</Text>
        {isValidPlace && 
          <View style={styles.cardAddress}>
            <FontAwesome5 name="map-marker-alt" size={18} color="#FF7600" />
            <Text>{data.address}</Text>
          </View>
        }
      </View>
    </TouchableOpacity>
  )
}

export default HangoutCard

const styles = StyleSheet.create({
  cardItem: {
    borderRadius: 18,
    padding: 14,
    boxShadow: '5px 10px 20px #3333334c',
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardImgWrap: {
    height: 131,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  cardImgTxtWrap: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 10,
    backgroundColor: '#ffffffcc',
    padding: 8,
  },
  cardImgDateWrap: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 54, 54, .50)',
    padding: 8,
  },
  cardImgTxt: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'Lexend-Medium',
    lineHeight: 14,
    color: '#333',
  },
  cardTtl: {
    fontFamily: 'Lexend-Medium',
    color: '#333',
    fontSize: 20,
    marginBottom: 12,
  },
  cardAddress: {
    fontFamily: 'Lexend-Regular',
    color: '#333',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
})