import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";

(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.style = { fontFamily: "Lexend-Regular" };

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.style = { fontFamily: "Lexend-Regular" };

export default function RootLayout() {
  const router = useRouter();
  let isAuth = false;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuth) {
        router.replace("/(auth)/login");
      } else {
        router.replace("/");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuth, router]);

  const [loaded] = useFonts({
    "Lexend-Bold": require("../assets/fonts/Lexend-Bold.ttf"),
    "Lexend-Light": require("../assets/fonts/Lexend-Light.ttf"),
    "Lexend-Medium": require("../assets/fonts/Lexend-Medium.ttf"),
    "Lexend-Regular": require("../assets/fonts/Lexend-Regular.ttf"),
    "Lexend-SemiBold": require("../assets/fonts/Lexend-SemiBold.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Italic": require("../assets/fonts/Montserrat-Italic.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      {/* <Stack.Screen
      name="(screen)"
      options={{headerShown:false}}
      /> */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
