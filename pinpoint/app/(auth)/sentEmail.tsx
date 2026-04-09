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
    if (email) {
      await findPassword(email);
    }

    router.push("/");
    console.log("success");
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

      <View className="flex items-center justify-center mt-10 pt-10 gap-5">
        <Image
          source={require("../../assets/images/icon-auth/icon_email.png")}
          className="mb-7 mt-10"
        ></Image>
        <Text className="font-MontserratBold text-2xl text-center">
          We have sent a password recover instructions to your email
        </Text>
        <Text className="font-Lexend text-center max-w-80 text-lg text-[#8F8F8F]">
          Did not recive the email? check you spam filter or resend
        </Text>
      </View>
    </SafeAreaView>
  );
}
