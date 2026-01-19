import React, { useState } from "react";
import { 
  View, Text, ScrollView, TextInput, TouchableOpacity, 
  Image, KeyboardAvoidingView, Platform 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

export default function CreatePostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tech"); 

  const categories = ["Tech", "Design", "Coding", "Lifestyle", "News", "Health"];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); 
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-slate-100">
        <View>
          <Text className="text-slate-500 text-xs font-bold tracking-widest uppercase">Draft</Text>
          <Text className="text-slate-900 text-xl font-black">New Story</Text>
        </View>
        <TouchableOpacity className="bg-teal-600 px-5 py-2 rounded-full shadow-sm">
          <Text className="text-white font-bold text-sm">Publish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        <View className="px-6 py-6">
          <TouchableOpacity 
            onPress={pickImage} 
            activeOpacity={0.7}
            className="w-full h-52 bg-slate-50 rounded-[30px] border-2 border-dashed border-slate-200 items-center justify-center overflow-hidden"
          >
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <View className="bg-white p-4 rounded-full shadow-sm mb-2">
                  <Feather name="image" size={28} color="#0d9488" />
                </View>
                <Text className="text-slate-400 font-bold">Add Cover Photo</Text>
              </View>
            )}
            {image && (
              <View className="absolute bottom-3 right-3 bg-black/50 p-2 rounded-full">
                <Feather name="edit-2" size={16} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="px-6 mb-6">
          <Text className="text-slate-400 text-xs font-black tracking-widest uppercase mb-3 ml-1">
            Select Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`mr-3 px-5 py-2.5 rounded-2xl border ${
                  selectedCategory === cat 
                  ? 'bg-teal-600 border-teal-600' 
                  : 'bg-white border-slate-100'
                }`}
              >
                <Text className={`font-bold text-xs ${
                  selectedCategory === cat ? 'text-white' : 'text-slate-500'
                }`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="px-6">
          <TextInput
            placeholder="Post Title"
            placeholderTextColor="#cbd5e1"
            className="text-2xl font-black text-slate-900 py-2 mb-6"
          />
          
          <View className="bg-slate-50 rounded-[30px] p-5 border border-slate-100 min-h-[300px]">
            <TextInput
              placeholder="Start writing..."
              multiline
              textAlignVertical="top"
              className="text-slate-700 text-base"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}