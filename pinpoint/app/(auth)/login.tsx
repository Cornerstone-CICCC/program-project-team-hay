import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/functions/auth.store";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const signIn = useAuthStore((s) => s.signIn);
  const onGoogleSignIn = useAuthStore((s)=>s.onGoogleSignIn)

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      router.push("../(root)/(tabs)/home");
    } catch (err) {
      Alert.alert("Error", "Failed to sign In. Please try again");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async()=>{
      try {
      const res = await onGoogleSignIn();

      if(!res){
        return
      }

      router.push("../(root)/(tabs)/home");
    } catch (err) {
      Alert.alert("Error", "Failed to sign up. Please try again");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <SafeAreaView edges={["top", "bottom"]} className="px-5">
      <View className="flex items-center mt-2 mb-10">
        <Text className="font-MontserratBold text-3xl">Sign In</Text>
      </View>

      <View>
        <View className="flex mb-5">
          <Text className="text-lg font-Lexend">Email address</Text>
          <TextInput
            placeholder="Input email address"
            placeholderTextColor={"#BCBCBC"}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            className="h-14 border border-solid rounded-md text-md font-Lexend py-2 ps-3 border-[#797979] mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa]"
            value={email}
            onChangeText={setEmail}
          ></TextInput>
        </View>

        <View className="flex mb-5">
          <Text className="text-lg font-Lexend">Password</Text>
          <View>
            <TextInput
              placeholder="Input your password"
              placeholderTextColor={"#BCBCBC"}
              autoComplete="password"
              secureTextEntry={showPwd}
              className="h-14 border border-solid rounded-md text-md font-Lexend py-2 ps-3 border-[#797979] mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa]"
              value={password}
              onChangeText={setPassword}
            ></TextInput>
            <TouchableOpacity
              className="absolute top-6 right-3"
              onPress={() => setShowPwd(!showPwd)}
            >
              <Ionicons 
                name={showPwd ? "eye-outline" : "eye-off-outline"} 
                size={24} 
                color="black" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="bg-[#FF7600] py-4 rounded-md flex items-center mb-6"
          onPress={handleSignIn}
        >
          {isLoading ? (
            <ActivityIndicator size={24} color="#fff"></ActivityIndicator>
          ) : (
            <Text className="font-LexendSemiBold text-lg text-[#FFFFFF] ">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="flex items-center mb-12"
          onPress={() => router.push("/(auth)/findPassword")}
        >
          <Text className="font-LexendSemiBold text-[#5669FF] text-lg">
            Forget Password?
          </Text>
        </TouchableOpacity>

        <View className="flex flex-row items-center justify-center gap-3 mb-7 ">
          <View
            style={{ height: 1, backgroundColor: "#bcbbbb", width: "30%" }}
          />
          <Text className="text-[#8F8F8F]">Or sign up with</Text>
          <View
            style={{ height: 1, backgroundColor: "#bcbbbb", width: "30%" }}
          />
        </View>

        <View className="mb-10 pb-10">
          <TouchableOpacity
            className="flex flex-row justify-center items-center gap-3 rounded-md py-4 shadow-sm bg-white mb-5"
            onPress={handleGoogleSignIn}
          >
            <Image
              source={require("../../assets/images/icon-auth/google_icon.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text className="font-LexendSemiBold text-lg">
              Continue with Google
            </Text>
          </TouchableOpacity>

          
        </View>

        <View
          style={{ height: 80, backgroundColor: "transparent", width: "100%" }}
        ></View>

        <TouchableOpacity
          className="flex items-center"
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text className="font-LexendSemiBold text-lg">
            You don&apos;t have an account?{" "}
            <Text className="font-LexendBold text-[#5669FF]">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
