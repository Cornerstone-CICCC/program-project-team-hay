import { Tabs } from "expo-router"
import { Text, View } from "react-native"
import Feather from '@expo/vector-icons/Feather';

const TabIcon =({ name, focused, label, roundBg = false }: { name: string, focused: boolean, label: string, roundBg?: boolean }) => {

  return (
    <View className='pb-3' style={{ minWidth: 46 }}>
      <View
        className={`items-center justify-center`}
        style={{
          width: roundBg ? 44 : undefined,
          height: roundBg ? 44 : undefined,
          borderRadius: roundBg ? 22 : undefined,
          boxShadow: roundBg ? '0 4px 8px #3333334c' : undefined,
          backgroundColor: roundBg ? '#FFA900' : 'transparent',
          marginBottom: roundBg ? 36 : 0,
          paddingTop: roundBg ? 14 : 0
        }}
      >
        <Feather
          name={name}
          size={22}
          color={roundBg ? '#fff' : focused ? '#FF7600' : '#333'}
        />
        <Text style={{ color: focused ? '#FF7600' : '#333', fontFamily: 'Lexend-Medium', fontSize: 12, marginTop: 3 }}>{label}</Text>
      </View>
    </View>
  )
}

const Layout = () => {
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
          paddingInline: 8,
          justifyContent:"space-between",
          alignItems:"center",
          flexDirection: "row",
          position:'fixed',
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
        name="createHangout"
        options={{
          title:'Create Hangout',
          headerShown:false,
          tabBarIcon: ({focused}) => <TabIcon focused={focused} name='plus-square' label='' roundBg={true} />
        }}
        
      />
      <Tabs.Screen
        name="chat"
        options={{
          title:'Chat',
          headerShown:false,
          tabBarIcon: ({focused}) => <TabIcon focused={focused} name='mail' label='Chat' />
          // tabBarIcon: ({focused}) => <TabIcon focused={focused} name='message-circle' />
          // tabBarIcon: ({focused}) => <TabIcon focused={focused} name='message-square' />
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