import { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

// type SearchType = 'email' | 'public_code'
// const types: SearchType[] = ['email', 'public_code']

type SearchType = 'public_code'
const types: SearchType[] = ['public_code']

const InviteFriendType = () => {
  // const [activeType, setActiveType] = useState<SearchType>('email')
  const [activeType, setActiveType] = useState<SearchType>('public_code')

  const onTypeChange = (type: SearchType) => {
    setActiveType(type)
  }
  console.log(activeType)

  return (
    <View style={styles.container}>
      {types.map(type => {
        const isActive = activeType === type
        return (
          <TouchableOpacity key={type} onPress={() => onTypeChange(type)} style={styles.radioItem}>
            <View style={styles.wrapRadio}>
              <View style={isActive ? styles.radioInput : undefined}></View>
            </View>
            <Text>{type}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default InviteFriendType

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 24,
  },
  radioItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  wrapRadio: {
    width: 24,
    height: 24,
    backgroundColor: '#0925681a',
    borderRadius: 12,
  },
  radioInput: {
    width: 14,
    height: 14,
    backgroundColor: '#092568',
    borderRadius: 9,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
})