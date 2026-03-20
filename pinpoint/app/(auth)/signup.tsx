import { useAuthStore } from "../../store/auth.store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPwd, setConfirmPwd] = useState<string>("");
  const [pwdError, setPwdError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const signUp = useAuthStore((s) => s.signUp);

  useEffect(() => {
    if (!confirmPwd) {
      setPwdError("");
      return;
    }

    if (confirmPwd !== password) {
      setPwdError("Passwords do not match");
    } else {
      setPwdError("");
    }
  }, [password, confirmPwd]);

  const handleConfirmPwd = (text: string) => {
    setConfirmPwd(text);

    if (password && text !== password) {
      setPwdError("Password do not match");
    } else {
      setPwdError("");
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password.length < 3) {
      Alert.alert("Error", "Password must be at least 3 charactors");
      return;
    }

    if (password !== confirmPwd) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, name);
      router.push("/(auth)/setProfile");
    } catch (err) {
      Alert.alert("Error", "Failed to sign up. Please try again");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="px-5">
      <View className="flex items-center mt-2 mb-10">
        <Text className="font-MontserratBold text-3xl">Sign Up</Text>
      </View>

      <View>
        <View className="flex mb-3">
          <Text className="text-base font-Lexend">Username</Text>
          <TextInput
            placeholder="Input your name"
            placeholderTextColor={"#BCBCBC"}
            className="border border-solid rounded-md text-base font-Lexend py-4 ps-3 border-[#797979] mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa] "
            value={name}
            onChangeText={setName}
          ></TextInput>
        </View>

        <View className="flex mb-3">
          <Text className="text-base font-Lexend">Email address</Text>
          <TextInput
            placeholder="Input email address"
            placeholderTextColor={"#BCBCBC"}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            className="border border-solid rounded-md text-base font-Lexend py-4 ps-3 border-[#797979] mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa]"
            value={email}
            onChangeText={setEmail}
          ></TextInput>
        </View>

        <View className="flex mb-3">
          <Text className="text-base font-Lexend">Password</Text>
          <TextInput
            placeholder="Input your password"
            placeholderTextColor={"#BCBCBC"}
            autoComplete="password"
            secureTextEntry
            className="border border-solid rounded-md text-base font-Lexend py-4 ps-3 border-[#797979] mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa]"
            value={password}
            onChangeText={setPassword}
          ></TextInput>
        </View>

        <View className="flex mb-3">
          <Text className="text-base font-Lexend">Confirm Password</Text>
          <TextInput
            placeholder="Input confirm password"
            placeholderTextColor={"#BCBCBC"}
            autoComplete="password"
            secureTextEntry
            className={`border border-solid rounded-md text-base font-Lexend py-4 ps-3 mt-2 focus:border-[#1849D6] focus:bg-[#e9edfa]`}
            value={confirmPwd}
            onChangeText={handleConfirmPwd}
          ></TextInput>
          {pwdError ? (
            <Text className="text-red-500 mt-1 text-sm font-Lexend">
              {pwdError}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          className="bg-[#FF7600] py-4 rounded-md flex items-center mb-6"
          onPress={handleSignUp}
        >
          {isLoading ? (
            <ActivityIndicator size={24} color="#fff" />
          ) : (
            <Text className="font-LexendSemiBold text-lg text-[#FFFFFF] ">
              Sign Up
            </Text>
          )}
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

          <TouchableOpacity className="flex flex-row justify-center items-center gap-3 rounded-md py-4 bg-black">
            <Image
              source={require("../../assets/images/icon-auth/apple_icon.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text className="text-white font-LexendSemiBold text-lg">
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="flex items-center"
          onPress={() => router.push("/(auth)/setProfile")}
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
