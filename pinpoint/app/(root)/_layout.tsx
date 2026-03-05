import { Stack } from "expo-router";

export default function Layout() {
  return (
    <>
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown:false}} />
      <Stack.Screen name="event/[id]" options={{headerShown:false}} />
      <Stack.Screen name="event/create-event" options={{headerShown:false}} />
    </Stack>
    </>
  )
}