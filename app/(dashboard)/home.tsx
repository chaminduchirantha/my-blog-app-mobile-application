import React from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"; // Icons සඳහා

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-slate-100">
        <View>
          <Text className="text-slate-500 text-xs font-bold tracking-widest">WELCOME BACK</Text>
          <Text className="text-slate-900 text-xl font-black">Hi, Dev User 👋</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-teal-100 items-center justify-center border border-teal-200">
          <Text className="text-teal-700 font-bold">JD</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        <View className="px-6 py-5">
          <View className="flex-row items-center bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm shadow-slate-200">
            <Feather name="search" size={20} color="#94a3b8" />
            <TextInput 
              placeholder="Search creative posts..." 
              className="flex-1 ml-3 text-slate-900"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View className="px-6 mb-6">
          <Text className="text-slate-900 text-lg font-bold mb-4">Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {['All', 'Design', 'Coding', 'Writing', 'Tech'].map((cat, index) => (
              <TouchableOpacity 
                key={index} 
                className={`mr-3 px-5 py-2.5 rounded-xl ${index === 0 ? 'bg-teal-600' : 'bg-white border border-slate-200'}`}
              >
                <Text className={`font-bold ${index === 0 ? 'text-white' : 'text-slate-500'}`}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-slate-900 text-lg font-bold mb-4">Featured Story</Text>
          <TouchableOpacity className="bg-teal-600 rounded-[30px] p-6 shadow-xl shadow-teal-600/40">
            <Text className="text-teal-100 text-xs font-black mb-2 tracking-widest uppercase">Editor's Choice</Text>
            <Text className="text-white text-2xl font-bold leading-8 mb-4">
              How to build premium apps with React Native & Tailwind
            </Text>
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-3">
                <Text className="text-white text-[10px] font-bold">AP</Text>
              </View>
              <Text className="text-teal-500 font-medium text-sm">By Alex Post • 5 min read</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-6 pb-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-slate-900 text-lg font-bold">Recent Posts</Text>
            <TouchableOpacity><Text className="text-teal-600 font-bold">View All</Text></TouchableOpacity>
          </View>

          {[1, 2, 3].map((item) => (
            <TouchableOpacity key={item} className="flex-row items-center bg-white p-4 rounded-2xl mb-4 border border-slate-100">
              <View className="w-16 h-16 rounded-xl bg-slate-100 items-center justify-center mr-4">
                <Feather name="image" size={24} color="#cbd5e1" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-bold text-base mb-1" numberOfLines={1}>
                  Mastering NativeWind in 2026
                </Text>
                <Text className="text-slate-500 text-xs">Jan 16 • 1.2k Views</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Floating Action Button (Create Post) */}
      <TouchableOpacity className="absolute bottom-8 right-8 w-14 h-14 bg-teal-600 rounded-full items-center justify-center shadow-xl shadow-teal-600/50">
        <Feather name="plus" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}