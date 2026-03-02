import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  return (
    <SafeAreaView edges={["top", "bottom"]} className="px-5">
      <View className="flex items-center mt-2 mb-10">
        <Text className="font-MontserratBold text-xl">Sign In</Text>
      </View>

      <View>
        <View className="flex mb-5">
          <Text>Email address</Text>
          <TextInput
            placeholder="Input email address"
            placeholderTextColor={"#BCBCBC"}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            className="border border-solid rounded-md text-base py-4 ps-3 border-[#797979] mt-2"
          ></TextInput>
        </View>

        <View className="flex mb-5">
          <Text>Password</Text>
          <TextInput
            placeholder="Input your password"
            placeholderTextColor={"#BCBCBC"}
            autoComplete="password"
            secureTextEntry
            className="border border-solid rounded-md text-base py-4 ps-3 border-[#797979] mt-2"
          ></TextInput>
        </View>

        <TouchableOpacity className="bg-[#FF7600] py-4 rounded-md flex items-center mb-6">
          <Text className="font-LexendSemiBold text-[#FFFFFF] ">Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex items-center mb-12">
          <Text className="font-LexendSemiBold text-[#5669FF]">
            Forget Password?
          </Text>
        </TouchableOpacity>

        <View className="mb-10 pb-10">
          <TouchableOpacity
            className="flex flex-row justify-center items-center gap-3  rounded-md py-4 shadow-sm bg-white mb-5
        "
          >
            <Image
              source={require("../../assets/images/logo/google_icon.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text className="font-LexendSemiBold ">Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex flex-row justify-center items-center gap-3 rounded-md py-4 bg-black">
            <Image
              source={require("../../assets/images/logo/apple_icon.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text className="text-white font-LexendSemiBold">
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="flex items-center">
          <Text className="font-LexendSemiBold">
            You don&apos;t have an account?{" "}
            <Text className="font-LexendSemiBold text-[#5669FF]">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
