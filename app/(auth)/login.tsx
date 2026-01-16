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
  Alert,
  useColorScheme 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";



export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || "light");

  const isDark = theme === "dark";


  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    console.log("Logging in with:", email, password);
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In Clicked");
  };


  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
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
            <TouchableOpacity
              onPress={() => setTheme(isDark ? "light" : "dark")}
              className="absolute right-6 top-6"
            >
              <Ionicons
                name={isDark ? "sunny" : "moon"}
                size={26}
                color={isDark ? "#99a1af" : "#99a1af"}
                style={{ opacity: 0.85 }}
              />
            </TouchableOpacity>

            <View className="w-16 h-16 rounded-2xl bg-teal-600 items-center justify-center mb-5 shadow-lg shadow-teal-600/50">
              <Text className="text-3xl text-white">✍️</Text>
            </View>

            <Text className="text-3xl font-extrabold text-center text-slate-900 mb-1">
              Welcome back
            </Text>
            <Text className="text-base text-slate-500 text-center px-4">
              Sign in to continue your creative journey
            </Text>
          </View>

          <View className={`flex-1 rounded-[20px] m-5 px-4 pt-10 shadow-2xl ${isDark ? "bg-slate-800" : "bg-white"}`}>
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
                className={`rounded-2xl border p-4 text-base ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </View>

            <View className="mb-8">
              <View className="flex-row justify-between mb-2 px-1">
                <Text className="text-xs font-bold text-slate-600 tracking-widest">
                  PASSWORD
                </Text>
              </View>
              <TextInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#94a3b8"
                className={`rounded-2xl border p-4 text-base ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.8}
              className="bg-teal-600 py-4 rounded-2xl items-center shadow-md shadow-teal-600/30"
            >
              <Text className="text-white font-bold text-lg">Sign In</Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-slate-100" />
              <Text className="mx-3 text-slate-400 text-xs font-bold">OR</Text>
              <View className="flex-1 h-[1px] bg-slate-100" />
            </View>

           <TouchableOpacity
                onPress={handleGoogleSignIn}
                activeOpacity={0.85}
                className={`rounded-2xl py-4 border flex-row items-center justify-center mb-6 ${
                  isDark
                    ? "bg-slate-700 border-slate-600"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
              <AntDesign
                name="google"
                size={20}
                color="#00bba7"
                style={{ marginRight: 12 }}
              />

              <Text
                className={`font-bold text-base ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Continue with Google
              </Text>
            </TouchableOpacity>


            <View className="flex-row justify-center pb-10">
              <Text className="text-slate-500 text-base">New to Dev Post? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text className="text-teal-600 font-black text-base">Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
