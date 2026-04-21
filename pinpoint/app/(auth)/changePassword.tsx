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
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ChangePassword() {
  const router = useRouter();

  const [oldPwd, setOldPwd] = useState<string>("");
  const [newPwd, setNewPwd] = useState<string>("");
  const [confirmPwd, setConfirmPwd] = useState<string>("");
  const [newPwdErr, setNewPwdError] = useState<string>("")
  const [pwdError, setPwdError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // toggle for passwords
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const user = useAuthStore((s) => s.user);
  const changePassword = useAuthStore((s) => s.changePassword);

  useEffect(() => {
    if(newPwd && !validatePassword(newPwd)) {
      setNewPwdError("Password must be 8+ chars, with uppercase, number and symbol")
    }else{
      setNewPwdError("")
    }
    

    if (confirmPwd && confirmPwd !== newPwd) {
      setPwdError("Passwords do not match");
    } else {
      setPwdError("");
    }
    
  }, [newPwd, confirmPwd]);

  const validatePassword = (pw: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[~`@#$%^&*()_\-+={[}\]|:;"'<,>.?/!])[A-Za-z\d~`@#$%^&*()_\-+={[}\]|:;"'<,>.?/!]{8,}$/
    return regex.test(pw)
  }
  

  const handleConfirmChange = (text: string) => {
    setConfirmPwd(text);

    if (newPwd && text !== newPwd) {
      setPwdError("Password do not match");
    } else {
      setPwdError("");
    }
  };

  const handleChangepassword = async () => {

    if (!oldPwd || !newPwd || !confirmPwd) {
      Alert.alert("Not Available", "Please enter all the fiels first");
      return
    }

    if(!validatePassword(newPwd)){
      Alert.alert("Error", "New password does not meet the requirements");
      return
    }

    if (newPwd !== confirmPwd) {
      Alert.alert("Error", "New password and confirm password do not match");
      return;
    }

    setIsLoading(true);
    try {
      

      if (user?.login_type !== "email") {
        Alert.alert(
          "Not Available",
          "Password change is not available for social login",
        );
        return;
      }
      if (user?.email) {
        await changePassword(user?.email, oldPwd, newPwd);
      }

      router.push("/");
      console.log("success");
    } catch (err) {
      Alert.alert("Error", "Failed to change password. Please try again");
      console.error(err);
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
        <Text className="font-MontserratBold text-2xl">Change Password</Text>
        <View />
      </View>

      <View className="mb-8">
        <Text className="text-2xl font-LexendSemiBold mb-2">
          Password Security
        </Text>
        <Text className="text-xl font-Lexend">
          Please enter at least 8 characters. Do not use easy-to-guess names
        </Text>
      </View>

      <View>
        <View className="mb-7">
          <View className="flex mb-5">
            <Text className="text-lg font-Lexend">Old Password</Text>
            <View className="relative justify-center">
              <TextInput
                placeholder="Input your password"
                placeholderTextColor={"#BCBCBC"}
                autoComplete="password"
                secureTextEntry={!showOldPwd}
                className="h-14 border border-solid rounded-md text-md font-Lexend py-2 ps-3 border-[#797979] mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa]"
                value={oldPwd}
                onChangeText={setOldPwd}
                style={{
                  textAlignVertical: "center"
                }}
              ></TextInput>
              <TouchableOpacity
                className="absolute top-6 right-3"
                onPress={() => setShowOldPwd(!showOldPwd)}
              >
                <Ionicons 
                  name={showOldPwd ? "eye-outline" : "eye-off-outline"} 
                  size={24} 
                  color="black" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex mb-5">
            <Text className="text-lg font-Lexend">New Password</Text>
            <View className="relative justify-center">
              <TextInput
                placeholder="Input your password"
                placeholderTextColor={"#BCBCBC"}
                autoComplete="password"
                secureTextEntry={!showNewPwd}
                className="h-14 border border-solid rounded-md text-md font-Lexend py-2 ps-3 border-[#797979] mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa]"
                value={newPwd}
                onChangeText={setNewPwd}
              ></TextInput>
              <TouchableOpacity
                className="absolute top-6 right-3"
                onPress={() => setShowNewPwd(!showNewPwd)}
              >
                <Ionicons 
                  name={showNewPwd ? "eye-outline" : "eye-off-outline"} 
                  size={24} 
                  color="black" 
                />
              </TouchableOpacity>
            </View>
            {newPwdErr ? (
              <Text className="text-red-500 mt-1 text-sm font-Lexend">
                {newPwdErr}
              </Text>
            ) : null}
          </View>

          <View className="flex mb-5">
            <Text className="text-lg font-Lexend">Confirm password</Text>
            <View className="relative justify-center">
              <TextInput
                placeholder="Input your password"
                placeholderTextColor={"#BCBCBC"}
                autoComplete="password"
                secureTextEntry={!showConfirmPwd}
                className="h-14 border border-solid rounded-md text-md font-Lexend py-2 ps-3 border-[#797979] mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa]"
                value={confirmPwd}
                onChangeText={handleConfirmChange}
              ></TextInput>
              <TouchableOpacity
                className="absolute top-6 right-3"
                onPress={() => setShowConfirmPwd(!showConfirmPwd)}
              >
                <Ionicons 
                  name={showConfirmPwd ? "eye-outline" : "eye-off-outline"} 
                  size={24} 
                  color="black" 
                />
              </TouchableOpacity>
            </View>
            {pwdError ? (
              <Text className="text-red-500 mt-1 text-sm font-Lexend">
                {pwdError}
              </Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          className="bg-[#FF7600] py-4 rounded-md flex items-center mb-6"
          onPress={handleChangepassword}
        >
          {isLoading ? (
            <ActivityIndicator size={24} color="#fff"></ActivityIndicator>
          ) : (
            <Text className="font-LexendSemiBold text-lg text-[#FFFFFF] ">
              Update Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
