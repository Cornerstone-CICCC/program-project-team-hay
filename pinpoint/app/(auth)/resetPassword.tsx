import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuthStore } from "../../store/functions/auth.store";
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

export default function ResetPassword() {
  const router = useRouter();

  const [newPwd, setNewPwd] = useState<string>("");
  const [confirmPwd, setConfirmPwd] = useState<string>("");
  const [pwdError, setPwdError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = useAuthStore((s) => s.resetPassword);

  const user = useAuthStore((s) => s.user);
  const changePassword = useAuthStore((s) => s.changePassword);
  const findPassword = useAuthStore((s) => s.findPassword);

  useEffect(() => {
    if (confirmPwd && newPwd !== confirmPwd) {
      setPwdError("Passwords do not match");
    } else {
      setPwdError("");
    }
  }, [newPwd, confirmPwd]);

  const handleConfirmChange = (text: string) => {
    setConfirmPwd(text);

    if (newPwd && text !== newPwd) {
      setPwdError("Password do not match");
    } else {
      setPwdError("");
    }
  };

  const handleResetPassword = async () => {
    if (newPwd !== confirmPwd) return;
    if (newPwd.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const success = await resetPassword(newPwd);
      if (success) {
        Alert.alert("Success", "Password updated successfully!", [
          { text: "OK", onPress: () => router.push("/(auth)/login") },
        ]);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="px-5">
      <View className="pt-4 flex flex-row justify-between mt-2 mb-10">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Text className="font-MontserratBold text-2xl">Reset Password</Text>
        <View />
      </View>

      <View className="mb-8">
        <Text className="text-2xl font-LexendSemiBold mb-2">
          Create New Password
        </Text>
        <Text className="text-xl font-Lexend">
          Your identity has been verified. Please set a new secure password.
        </Text>
      </View>

      <View>
        <View className="mb-7">
          <View className="flex mb-5">
            <Text className="text-lg font-Lexend">New Password</Text>
            <TextInput
              placeholder="Input your password"
              placeholderTextColor={"#BCBCBC"}
              autoComplete="password"
              secureTextEntry
              className="border border-solid rounded-md text-lg font-Lexend py-4 ps-3 border-[#797979] mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa]"
              value={newPwd}
              onChangeText={setNewPwd}
            ></TextInput>
          </View>

          <View className="flex mb-5">
            <Text className="text-lg font-Lexend">Confirm new password</Text>
            <TextInput
              placeholder="Input your password"
              placeholderTextColor={"#BCBCBC"}
              autoComplete="password"
              secureTextEntry
              className={`border border-solid rounded-md text-lg font-Lexend py-4 ps-3 border-[#797979] mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa]`}
              value={confirmPwd}
              onChangeText={handleConfirmChange}
            ></TextInput>
            {pwdError ? (
              <Text className="text-red-500 mt-1 text-sm font-Lexend">
                {pwdError}
              </Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          className="bg-[#FF7600] py-4 rounded-md flex items-center"
          onPress={handleResetPassword}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-LexendSemiBold text-lg text-white">
              Update Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
