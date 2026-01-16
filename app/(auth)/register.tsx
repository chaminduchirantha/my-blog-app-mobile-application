import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StatusBar, 
  Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";


export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    console.log("Registering with:", name, email, password);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View className="px-6 pt-10 pb-8 items-center">
            <View className="w-16 h-16 rounded-2xl bg-teal-600 items-center justify-center mb-5 shadow-lg shadow-teal-600/50">
              <Text className="text-3xl text-white">✍️</Text>
            </View>

            <Text className="text-3xl font-extrabold text-center text-slate-900 mb-1">
              Create Account
            </Text>
            <Text className="text-base text-slate-500 text-center px-4">
              Sign up to start your creative journey
            </Text>
          </View>

          <View className="flex-1 bg-white rounded-[20px] m-5 px-4 pt-10 shadow-2xl shadow-black">
            <View className="mb-5">
              <Text className="text-xs font-bold text-slate-600 mb-2 ml-1 tracking-widest">
                FULL NAME
              </Text>
              <TextInput
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                placeholderTextColor="#94a3b8"
                className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-slate-900 text-base"
              />
            </View>

            <View className="mb-5">
              <Text className="text-xs font-bold text-slate-600 mb-2 ml-1 tracking-widest">
                EMAIL ADDRESS
              </Text>
              <TextInput
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#94a3b8"
                className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-slate-900 text-base"
              />
            </View>

            <View className="mb-5">
              <Text className="text-xs font-bold text-slate-600 mb-2 ml-1 tracking-widest">
                PASSWORD
              </Text>
              <TextInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#94a3b8"
                className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-slate-900 text-base"
              />
            </View>

            <View className="mb-8">
              <Text className="text-xs font-bold text-slate-600 mb-2 ml-1 tracking-widest">
                CONFIRM PASSWORD
              </Text>
              <TextInput
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#94a3b8"
                className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-slate-900 text-base"
              />
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              activeOpacity={0.8}
              className="bg-teal-600 py-4 rounded-2xl items-center shadow-md shadow-teal-600/30"
            >
              <Text className="text-white font-bold text-lg">Sign Up</Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-slate-100" />
              <Text className="mx-3 text-slate-400 text-xs font-bold">OR</Text>
              <View className="flex-1 h-[1px] bg-slate-100" />
            </View>

            <TouchableOpacity
              className="bg-white py-4 rounded-2xl border border-slate-200 flex-row items-center justify-center mb-6"
            >
              <Text className="text-xl mr-3">🔍</Text>
              <Text className="text-slate-700 font-bold text-base">Continue with Google</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center pb-10">
              <Text className="text-slate-500 text-base">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="text-teal-600 font-black text-base">Login Account</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
