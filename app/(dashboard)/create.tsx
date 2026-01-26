import React, { useEffect, useState } from "react";
import { 
  View, Text, ScrollView, TextInput, TouchableOpacity, 
  Image, KeyboardAvoidingView, Platform, 
  Alert,
  useColorScheme
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { addPost } from "@/services/postService";
import { auth, db } from "@/services/firbase";
import { useRouter } from "expo-router";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp
} from "firebase/firestore";

export default function CreatePostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tech"); 
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const user = auth.currentUser;
  const systemTheme = useColorScheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [userName, setUserName] = useState("User");
  
  const [theme, setTheme] = useState(systemTheme || "light");
  
  const isDark = theme === "dark";

  const categories = ["Tech", "Design", "Coding", "Writing"];

    const router = useRouter();
  

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

   useEffect(() => {
      const fetchPostsAndProfile = async () => {
        try {
          const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  
          const snapshot = await getDocs(q);
  
          const postsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          setPosts(postsData);
  
          if (!user) return;
  
          setUserName(user.displayName || "User");
  
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
  
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.photoURL) {
              setProfileImage(data.photoURL);
            } else if (user.photoURL) {
              setProfileImage(user.photoURL);
            } else {
              setProfileImage(null);
            }
          } else {
            setProfileImage(user.photoURL || null);
          }
  
          // Fetch likes for all posts
          // await fetchLikesForPosts(postsData);
        } catch (error) {
          console.log("Error loading home data:", error);
        }
      };
  
      fetchPostsAndProfile();
    }, []);

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
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className={`pt-12 pb-4 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        
          <View className="px-6 flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-teal-500 text-[10px] font-black tracking-[2px]">HELLO</Text>
              <Text className={`${isDark ? "text-white" : "text-slate-900"} text-xl font-bold`}>
                {userName} 👋
              </Text>
            </View>

            <View className="flex-row items-center gap-x-3">
              <TouchableOpacity
                onPress={() => setTheme(isDark ? "light" : "dark")}
                className={`p-2.5 rounded-2xl ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200"}`}
              >
                <Ionicons name={isDark ? "sunny" : "moon"} size={20} color={isDark ? "#fbbf24" : "#64748b"} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="w-11 h-11 rounded-2xl border-2 border-teal-500/20 overflow-hidden"
                onPress={() => router.push("/profile")}
              >
                {profileImage ? (
                  <Image source={{ uri: profileImage }} className="w-full h-full" />
                ) : (
                  <View className="bg-teal-500 w-full h-full items-center justify-center">
                    <Text className="text-white font-bold">{userName.charAt(0)}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View className="px-6 mb-6">
          <Text className="text-slate-400 text-xs font-black tracking-widest uppercase mb-6 ml-1">
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
            className={`text-md rounded-2xl py-4 p-5 mb-6 border
            ${isDark 
              ? "bg-slate-900 text-white border-slate-700" 
              : "bg-slate-50 text-black border-black"
            }`}
          />

          <TextInput
            placeholder="Author name"
            value={author}
            onChangeText={setAuthor}
            className={`text-md rounded-2xl py-4 p-5 mb-6 border
            ${isDark 
              ? "bg-slate-900 text-white border-slate-700" 
              : "bg-slate-50 text-black border-black"
            }`}
          />
          
          <View className={`rounded-[30px] p-5 min-h-[300px] border
            ${isDark 
              ? "bg-slate-900 border-slate-700" 
              : "bg-slate-50 border-black"
            }`}>
            <TextInput
              placeholder="Start writing..."
              multiline
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
              className={`text-base ${isDark ? "text-white" : "text-black"}`}  
            />
          </View>

          <View className="px-6 py-6">
            <TouchableOpacity 
              onPress={pickImage} 
              activeOpacity={0.7}
              className={`w-full h-52 ${isDark ? "bg-slate-900" : "bg-slate-50"} rounded-[30px] ${isDark ? "border border-slate-700" : "border border-black"} border-dashed items-center justify-center overflow-hidden`}
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

          <View className={`px-6 py-4 flex-row justify-between items-center border-b
            ${isDark 
              ? "bg-slate-950 border-slate-800" 
              : "bg-white border-slate-100"
            }`}>
            <View>
              <Text className={`${isDark ? "text-slate-500" : "text-slate-400"} text-xs font-bold tracking-widest uppercase`}>Draft</Text>
              <Text className={`${isDark ? "text-white" : "text-slate-900"} text-xl font-black`}>New Story</Text>
            </View>
            <TouchableOpacity className="bg-teal-600 px-5 py-2 rounded-full shadow-sm" onPress={handlePublish}>
              <Text className="text-white font-bold text-sm">Publish and view</Text>
            </TouchableOpacity>
          </View>
        </View> 
      </ScrollView>


     <View className="absolute bottom-6 left-4 right-4">
        <View className={`${isDark ? "bg-slate-900" : "bg-white"} flex-row items-center justify-around py-3 rounded-3xl shadow-xl border ${isDark ? "border-slate-800" : "border-slate-100"}`}>
          <TouchableOpacity className="items-center px-4" onPress={() => router.push("/home")}>
            <Ionicons name="home-outline" size={24} color="#64748b" />
            <Text className="text-[10px] text-slate-500 mt-1">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center px-4" onPress={() => router.push("/bookmarks")}>
            <Ionicons name="bookmark-outline" size={24} color="#64748b" />
            <Text className="text-[10px] text-slate-600 font-bold mt-1">Saved</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push("/create")}
            className="w-14 h-14 bg-teal-600 rounded-full items-center justify-center -mt-10 shadow-lg dark:border-slate-950"
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity className="items-center px-4" onPress={() => router.push("/topics")}>
            <Ionicons name="search-outline" size={24} color="#64748b" />
            <Text className="text-[10px] text-slate-500 mt-1">Explore</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center px-4" onPress={() => router.push("/profile")}>
            <Ionicons name="person-outline" size={24} color="#64748b" />
            <Text className="text-[10px] text-slate-500 mt-1">Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}