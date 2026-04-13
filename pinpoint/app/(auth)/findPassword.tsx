import { useAuthStore } from "@/store/functions/auth.store";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FindPassword() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const findPassword = useAuthStore((s) => s.findPassword);

  const handleFindPassword = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    const success = await findPassword(email);

    if (success) {
      router.push({
        pathname: "/(auth)/sentEmail",
        params: { email: email },
      });
      console.log("success");
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="px-5">
      <View className="flex flex-row justify-between mt-2 mb-10 pt-4">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Text className="font-MontserratBold text-2xl"> Forgot Password</Text>
        <View />
      </View>

      <View className="flex items-center justify-center mb-10 gap-5">
        <Image
          source={require("../../assets/images/icon-auth/lock_icon.png")}
          className="mb-5"
        ></Image>
        <Text className="font-MontserratBold text-3xl">
          Forgot your password?
        </Text>
        <Text className="font-Lexend text-center max-w-80">
          Enter your registered email below to receive password rest instruction
        </Text>
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
            value={email}
            onChangeText={setEmail}
          ></TextInput>
        </View>

        <TouchableOpacity
          className="bg-[#FF7600] py-4 rounded-md flex items-center mb-6"
          onPress={handleFindPassword}
        >
          <Text className="font-LexendSemiBold text-lg text-[#FFFFFF] ">
            Send
          </Text>
        </TouchableOpacity>

        <View
          style={{ height: 260, backgroundColor: "transparent", width: "100%" }}
        ></View>

        <TouchableOpacity
          className="flex items-center"
          onPress={() => router.push("/(auth)/login")}
        >
          <Text className="font-LexendSemiBold text-lg">
            You remember your password?{" "}
            <Text className="font-LexendBold text-[#5669FF]">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
