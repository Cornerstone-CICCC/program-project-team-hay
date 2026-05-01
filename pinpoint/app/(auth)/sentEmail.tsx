import { useAuthStore } from "@/store/functions/auth.store";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { StyleSheet } from "react-native";

const CELL_COUNT = 6;

export default function VerifyOtp() {
  const router = useRouter();

  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");

  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const findPassword = useAuthStore((s) => s.findPassword);

  const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otp,
    setValue: setOtp,
  });

  const handleConfirm = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter 6-digit code");
      return;
    }

    const isVerified = await verifyOtp(email, otp);
    if (isVerified) {
      router.push("/(auth)/resetPassword");
    }
  };

  const handleResend = async () => {
    await findPassword(email);
    Alert.alert("Success", "OTP has been resent to your email.");
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

      <View className="flex items-center justify-center mt-10 pt-5 gap-5">
        <Image
          source={require("../../assets/images/icon-auth/icon_email.png")}
          className="mb-7 mt-10"
        ></Image>
        <Text className="font-MontserratBold text-2xl text-center max-w-80">
          We have sent you an Email please check your Mail and Complete OTP Code
        </Text>

        <CodeField
          ref={ref}
          {...props}
          value={otp}
          onChangeText={setOtp}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              onLayout={getCellOnLayoutHandler(index)}
              style={[styles.cell, isFocused && styles.focusCell]}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          className="bg-[#FF7600] w-full py-4 rounded-md flex items-center mt-5"
          onPress={handleConfirm}
        >
          <Text className="font-LexendSemiBold text-lg text-white">
            Confirm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend}>
          <Text className="font-Lexend text-[#8F8F8F] text-lg mt-5">
            Did not receive the email?{" "}
            <Text className="text-[#FF7600] font-LexendBold">Resend</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  codeFieldRoot: { marginTop: 20, width: "100%", paddingHorizontal: 10 },
  cell: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#797979",
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  cellText: { fontSize: 20, fontFamily: "Lexend", textAlign: "center" },
  focusCell: { borderColor: "#1849D6", borderWidth: 2 },
});
