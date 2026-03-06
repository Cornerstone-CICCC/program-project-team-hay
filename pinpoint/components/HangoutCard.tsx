import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from "expo-router";

type Hangout = {
  id: string,
  name: string,
  date_time: string,
  image: ImageSourcePropType,
  place_name: string,
  address: string
}

type Props = {
  data: Hangout
}

const HangoutCard = ({ data }: Props) => {
  const router = useRouter()
  const goToEventDetail = () => {
    router.push(`/event/${data.id}`)
  }
  const date = new Date(data.date_time)
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const day = date.getDate()

  return (
    <TouchableOpacity onPress={goToEventDetail}>
      <View style={styles.cardItem}>
        <View style={styles.cardImgWrap}>
          <Image source={data.image} style={styles.cardImg} />
          <View style={styles.cardImgTxtWrap}>
            <Text style={styles.cardImgTxt}>{month}</Text>
            <Text style={styles.cardImgTxt}>{day}</Text>
          </View>
        </View>
        <Text style={styles.cardTtl}>{data.name}</Text>
        <View style={styles.cardAddress}>
          <FontAwesome5 name="map-marker-alt" size={18} color="#FF7600" />
          <Text>{data.address}</Text>
        </View>
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
    objectFit: 'cover',
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
  cardImgTxt: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'Lexend-Medium',
    lineHeight: 14,
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