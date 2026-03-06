import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function SetProfile() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need camera roll permission to select a profile image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need camera permission to take a photo",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const showPhotoPicker = () => {
    Alert.alert("Select Profile Photo", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo", onPress: pickPhoto },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="px-5">
      <View className="flex items-center mt-2 mb-10">
        <Text className="font-MontserratBold text-3xl">Profile</Text>
      </View>
      <View className="flex items-center gap-3">
        <Text
          className="font-LexendMedium text-2xl mb-5 text-center"
          style={{ maxWidth: 300 }}
        >
          Adding Photo to make your profile stunning
        </Text>

        <TouchableOpacity onPress={showPhotoPicker} className="relative">
          <FontAwesome
            name="photo"
            size={80}
            color="#7C7C7C"
            className="mb-12"
          />
          <Text className="absolute bottom-10 right-0 bg-[#333333] text-[#F3F3F3] text-2xl px-2 rounded-xl">
            +
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex justify-center gap-3 px-3 mb-10">
        <View>
          <Text className="font-Lexend text-xl mb-1 text-[#333333] px-2">
            Name
          </Text>
          <Text className="border-2 font-LexendLight text-xl px-2 py-2 rounded-xl border-[#FF7600] text-[#333333]">
            James Smith
          </Text>
        </View>

        <View>
          <Text className="font-Lexend text-xl mb-1 text-[#333333] px-2">
            Email
          </Text>
          <Text className="border-2 font-LexendLight text-xl px-2 py-2 rounded-xl border-[#FF7600] text-[#333333]">
            James@gmail.com
          </Text>
        </View>

        <View>
          <Text className="font-Lexend text-xl mb-1 text-[#333333] px-2">
            Public Code
          </Text>
          <Text className="border-2 font-LexendLight text-xl px-2 py-2 rounded-xl border-[#FF7600] text-[#333333]">
            xofj218xd
          </Text>
        </View>
      </View>
      <View className="mt-5">
        <TouchableOpacity className="bg-[#FF7600] py-4 rounded-md flex items-center mb-10">
          <Text className="font-LexendSemiBold text-lg text-[#FFFFFF] ">
            Complete Setup
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex items-center"
          onPress={() => router.push("/(auth)/login")}
        >
          <Text className="font-LexendSemiBold text-lg">
            You don&apos;t have an account?{" "}
            <Text className="font-LexendBold text-[#5669FF]">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
