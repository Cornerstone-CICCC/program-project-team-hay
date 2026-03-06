import { useRouter } from "expo-router";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();

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
            className="border border-solid rounded-md text-lg font-Lexend py-4 ps-3 border-[#797979] mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa]"
          ></TextInput>
        </View>

        <View className="flex mb-5">
          <Text className="text-lg font-Lexend">Password</Text>
          <TextInput
            placeholder="Input your password"
            placeholderTextColor={"#BCBCBC"}
            autoComplete="password"
            secureTextEntry
            className="border border-solid rounded-md text-lg font-Lexend py-4 ps-3 border-[#797979] mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa]"
          ></TextInput>
        </View>

        <TouchableOpacity className="bg-[#FF7600] py-4 rounded-md flex items-center mb-6">
          <Text className="font-LexendSemiBold text-lg text-[#FFFFFF] ">
            Sign In
          </Text>
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
            className="flex flex-row justify-center items-center gap-3 rounded-md py-4 shadow-sm bg-white mb-5
        "
          >
            <Image
              source={require("../../assets/images/icon-auth/google_icon.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text className="font-LexendSemiBold text-lg">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-row justify-center items-center gap-3 rounded-md py-4 bg-black"
            onPress={() => router.push("/(auth)/accountSetting")}
          >
            <Image
              source={require("../../assets/images/icon-auth/apple_icon.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text className="text-white font-LexendSemiBold text-lg">
              Continue with Apple
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
