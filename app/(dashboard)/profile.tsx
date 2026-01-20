import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/services/firbase";
import { useState } from "react";
import { router } from "expo-router";


export default function ProfileScreen() {

    const [modalVisible, setModalVisible] = useState(false);


    const user = auth.currentUser;
    const firstLetter = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : "U";


    const handleSave = async () => {
    try {
      setModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>

        <View className="items-center mt-8">
          <Text className="text-black px-10 py-8 bg-teal-600 rounded-full text-5xl font-bold">
              {firstLetter}
            </Text>
          <Text className="text-xl font-bold mt-4">
            {user?.displayName || "No Name"}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            {user?.email} | Blogger ✍️
          </Text>
        </View>

        <View className="flex-row justify-around mt-8">
          <View className="items-center">
            <Text className="text-lg font-bold">24</Text>
            <Text className="text-gray-500 text-sm">Post count</Text>
          </View>
        </View>

        <View className="flex-row justify-center gap-4 mt-8">
          <TouchableOpacity className="bg-teal-600 px-6 py-3 rounded-xl" onPress={() => setModalVisible(true)}>
            <Text className="text-white font-semibold">
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-red-500 px-6 py-3 rounded-xl" onPress={()=>router.push("/(auth)/login")}>
            <Text className="text-white font-semibold">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-10">
          <Text className="text-lg font-bold mb-4">
            My Posts
          </Text>

          <View className="bg-gray-100 p-4 rounded-xl mb-3">
            <Text className="font-semibold text-base">
              Mastering React Native
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              Jan 18, 2026
            </Text>
          </View>

          <View className="bg-gray-100 p-4 rounded-xl mb-3">
            <Text className="font-semibold text-base">
              Why MERN Stack is Powerful
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              Jan 15, 2026
            </Text>
          </View>
        </View>

      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-2xl p-6">

            <Text className="text-lg font-bold mb-4">
              Edit Profile
            </Text>

            <Text className="text-sm text-gray-500 mb-2">
              Name
            </Text>

            <TextInput
              placeholder="Enter your new name"
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="text-sm text-gray-500 mb-2">
              email
            </Text>

            <TextInput
              placeholder="Enter your New email"
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
            />

            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                className="px-4 py-2"
              >
                <Text className="text-gray-500 font-semibold" onPress={() => setModalVisible(false)}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-teal-600 px-5 py-2 rounded-xl"
              >
                <Text className="text-white font-semibold">
                  Save
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
