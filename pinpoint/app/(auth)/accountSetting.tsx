import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { Feather } from "@react-native-vector-icons/feather";
import { useAuthStore } from "../../store/functions/auth.store";
import { uploadProfileImage } from "../../libs/supabase/storage";
import { Image } from "expo-image";
import MaterialIcons from "@react-native-vector-icons/material-icons";

export default function AccountSetting() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {}, [profileImage]);

  const handleUpdate = async () => {
    setIsEditing(false);
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

      const updateData: any = {
        name: name,
      };

      if (profileImageUrl) {
        updateData.profileImage = profileImageUrl;
      }

      // Update profile
      await updateUser(updateData);
      Alert.alert(
        "Successfully Updated",
        "Your changes have been saved successfully",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false },
      );
      // router.replace("/");
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
      console.log("get image");
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
      console.log("get image");
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
      <View className="flex items-center mt-2 mb-5">
        <Text className="font-MontserratBold text-3xl">Account Setting</Text>
      </View>
      <View className="flex items-center gap-3 mt-5 mb-10">
        <TouchableOpacity onPress={showPhotoPicker} className="relative">
          {profileImage || user?.profileImage ? (
            <Image
              source={{ uri: profileImage || user?.profileImage }}
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

          <Text className="absolute bottom-0 right-0 bg-[#333333] text-[#F3F3F3] text-lg px-2 rounded-xl">
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex justify-center items-center gap-5 px-3 mb-10">
        <View className="flex flex-row items-center">
          {isEditing ? (
            <TextInput
              value={name}
              onChangeText={setName}
              className="border-2 font-LexendSemiBold text-4xl px-2 py-2 text-[#333333] border-[#FF7600] rounded-xl focus:bg-[#FFEFDB]"
            />
          ) : (
            <View className="flex flex-row items-center">
              <Text className="font-LexendSemiBold text-4xl px-2 py-2 text-[#333333] ">
                {name}
              </Text>
              <TouchableOpacity onPress={() => setIsEditing((prev) => !prev)}>
                <Feather
                  name="edit"
                  size={25}
                  color="#FF7600"
                  className="mb-12"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="flex items-center">
          <Text className="font-LexendSemiBold text-2xl px-2 text-[#333333]">
            Email
          </Text>
          <Text className="font-Lexend text-2xl px-2 py-2 text-[#333333]">
            {user?.email}
          </Text>
        </View>

        <View className="flex items-center">
          <Text className="font-LexendSemiBold text-2xl px-2 text-[#333333]">
            Public Code
          </Text>
          <Text className="font-Lexend text-2xl px-2 py-2 text-[#333333]">
            {user?.public_code}
          </Text>
        </View>

        <View className="flex items-center">
          <Text className="font-LexendSemiBold text-2xl px-2 text-[#333333]">
            Login Type
          </Text>
          <Text className="font-Lexend text-2xl px-2 py-2 text-[#333333]">
            {user?.login_type}
          </Text>
        </View>
      </View>
      <View className="mt-2 mb-8">
        <TouchableOpacity
          className="flex items-center "
          onPress={() => router.push("/(auth)/changePassword")}
        >
          <Text className="text-[#5669FF] font-Lexend text-xl">
            Change Password?
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-5">
        <TouchableOpacity
          className="bg-[#FF7600] py-4 rounded-md flex items-center mb-10"
          onPress={handleUpdate}
        >
          {isLoading ? (
            <ActivityIndicator size={24} color="#fff" />
          ) : (
            <Text className="font-LexendSemiBold text-xl text-[#FFFFFF] ">
              Update Profile
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
