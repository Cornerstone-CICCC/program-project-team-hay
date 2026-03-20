import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { uploadProfileImage } from "../../libs/supabase/storage";
import { useAuthStore } from "../../store/auth.store";
import Feather from "@react-native-vector-icons/feather";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";

export default function SetProfile() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Upload profile img
      let profileImageUrl: string | undefined;
      if (profileImage) {
        try {
          profileImageUrl = await uploadProfileImage(user.id, profileImage);
        } catch (err) {
          console.error("Error uploading profile image", err);
          Alert.alert(
            "Warning",
            "Failed to upload profile image. Continuing without image",
          );
        }
      }

      // Update profile
      await updateUser({
        profileImage: profileImageUrl,
        onboardingCompleted: true,
      });
      router.replace("/(auth)/login");
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to complete the onboarding. Please try again",
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "white",
              }}
            />
          ) : (
            <View
              className="bg-[#CCCCCC] rounded-full flex items-center justify-center"
              style={{ width: 100, height: 100 }}
            >
              <MaterialIcons name="add-a-photo" size={42} color="#353535" />
            </View>
          )}
          <Text className="absolute bottom-2 right-0 bg-[#333333] text-[#F3F3F3] text-xl px-2 rounded-full">
            +
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex justify-center gap-3 px-3 mb-10">
        <View>
          <Text className="font-Lexend text-xl mb-1 text-[#333333] px-2">
            Name
          </Text>
          <View className="border-2 flex flex-row justify-between items-center rounded-xl border-[#FF7600]">
            <Text className=" font-LexendLight text-xl px-2 py-2  text-[#333333]">
              {user?.name}
            </Text>
          </View>
        </View>

        <View>
          <Text className="font-Lexend text-xl mb-1 text-[#333333] px-2">
            Email
          </Text>
          <Text className="border-2 font-LexendLight text-xl px-2 py-2 rounded-xl border-[#FF7600] text-[#333333]">
            {user?.email}
          </Text>
        </View>

        <View>
          <Text className="font-Lexend text-xl mb-1 text-[#333333] px-2">
            Public Code
          </Text>
          <Text className="border-2 font-LexendLight text-xl px-2 py-2 rounded-xl border-[#FF7600] text-[#333333]">
            {user?.public_code}
          </Text>
        </View>
      </View>
      <View className="mt-5">
        <TouchableOpacity
          className="bg-[#FF7600] py-4 rounded-md flex items-center mb-10"
          onPress={handleComplete}
        >
          {isLoading ? (
            <ActivityIndicator size={24} color="#fff" />
          ) : (
            <Text className="font-LexendSemiBold text-lg text-[#FFFFFF] ">
              Complete Setup
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
