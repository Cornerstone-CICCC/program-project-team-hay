import { Tabs, useRouter } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"
import Feather from '@expo/vector-icons/Feather';

const TabIcon =({ name, focused, label, createBtn = false }: { name: string, focused: boolean, label: string, createBtn?: boolean }) => {

  return (
    <View className='pb-4' style={{ minWidth: 54 }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
      >
        <Feather
          name={name}
          size={22}
          color={createBtn ? '#fff' : focused ? '#FF7600' : '#333'}
        />
        {label.trim() && <Text style={{ color: focused ? '#FF7600' : '#333', fontFamily: 'Lexend-Medium', fontSize: 12, marginTop: 3 }}>{label}</Text>}
      </View>
    </View>
  )
}

const Layout = () => {
  const router = useRouter()

  return (
    // navigation
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "#FF7600",
        tabBarInactiveTintColor: "#FF7600",
        tabBarShowLabel: false,
        tabBarStyle:{
          backgroundColor: "#fff",
          paddingHorizontal: 8,
          alignItems:"center",
          flexDirection: "row",
          position:'absolute',
          bottom: 0,
          left: 0,
          width: '100%'
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title:'Home',
          headerShown:false,
          tabBarIcon: ({focused}) => <TabIcon focused={focused} name='home' label='Home' />
        }}
      />
      <Tabs.Screen
        name="hangout"
        options={{
          title:'Hangout',
          headerShown:false,
          tabBarIcon: ({focused}) => <TabIcon focused={focused} name='calendar' label='Hangout' />
        }}
      />
      <Tabs.Screen
        name="DummyCreateEvent"
        options={{
          title:'Create Hangout',
          headerShown:false,
          tabBarIcon: () => (
            <TouchableOpacity
              onPress={() => router.push('/event/create-event')}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                boxShadow: '0 4px 8px #3333334c',
                backgroundColor: '#FFA900',
                marginBottom: 40,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                paddingTop: 9,
              }}>
              <TabIcon focused={false} name='plus-square' label='' createBtn={true} />
            </TouchableOpacity>
          )
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title:'Chat',
          headerShown:false,
          tabBarIcon: ({focused}) => <TabIcon focused={focused} name='mail' label='Chat' />
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title:'Account',
          headerShown:false,
          tabBarIcon: ({focused}) => <TabIcon focused={focused} name='user' label='Account' />
        }}
        />
    </Tabs>
  )
}

export default Layout