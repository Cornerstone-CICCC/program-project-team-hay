import { Text, View } from "react-native";
import { Redirect } from "expo-router";

console.log('index rendering ✅'); 
export default function Index() {
    console.log('index component ✅');
  return (
    <Redirect href="/event/1"/>
    // <Redirect href="/event/create-event"/>

    // <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
    //   <Text style={{ fontSize: 24, color: 'black' }}>Welcome</Text>
    // </View>

  )
}
