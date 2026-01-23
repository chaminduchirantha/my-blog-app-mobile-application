import React, { useState } from "react";
import { 
  View, Text, ScrollView, TextInput, TouchableOpacity, 
  Image, KeyboardAvoidingView, Platform, 
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { addPost } from "@/services/postService";

export default function CreatePostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tech"); 
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const categories = ["Tech", "Design", "Coding", "Writing"];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getImageBase64 = async (uri: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      return await new Promise((resolve, reject) => {
        reader.onerror = () => reject(null);
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.log("Error converting image:", err);
      return null;
    }
  };

  const handlePublish = async () => {
    if (!title || !author || !content) {
      Alert.alert("Please fill all fields");
      return;
    }

    let imageBase64: string | null = null;
    if (image) {
      imageBase64 = await getImageBase64(image);
    }

    try {
      await addPost(title, author, selectedCategory, content, imageBase64);
      Alert.alert("Post created!", `Title: ${title}`);
      
      setTitle("");
      setAuthor("");
      setContent("");
      setImage(null);
      setSelectedCategory("Tech");
    } catch (err: any) {
      console.log(err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };
  

  return (
    <SafeAreaView className="flex-1 bg-white">
      

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        

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
            placeholder="Post title"           
            value={title}
            onChangeText={setTitle}
            className="text-md rounded-2xl text-black py-4  p-5  mb-6 bg-slate-50 border border-black"
          />

          <TextInput
            placeholder="Author name"
            value={author}
            onChangeText={setAuthor}
            className="text-md rounded-2xl border border-black  p-5  text-black py-4 mb-6 bg-slate-50"
          />
          
          <View className="bg-slate-50 rounded-[30px] p-5 min-h-[300px] border border-black">
            <TextInput
              placeholder="Start writing..."
              multiline
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
              className="text-slate-700 text-base "
            />
          </View>

          <View className="px-6 py-6">
          <TouchableOpacity 
            onPress={pickImage} 
            activeOpacity={0.7}
            className="w-full h-52 bg-slate-50 rounded-[30px] border border-black  border-dashed items-center justify-center overflow-hidden"
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

        <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-slate-100">
        <View>
          <Text className="text-slate-500 text-xs font-bold tracking-widest uppercase">Draft</Text>
          <Text className="text-slate-900 text-xl font-black">New Story</Text>
        </View>
        <TouchableOpacity className="bg-teal-600 px-5 py-2 rounded-full shadow-sm" onPress={handlePublish}>
          <Text className="text-white font-bold text-sm">Publish and view</Text>
        </TouchableOpacity>
      </View>
        </View> 
      </ScrollView>
    </SafeAreaView>
  );
}