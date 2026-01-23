import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { collection, getDocs,getDoc, query, orderBy, doc } from "firebase/firestore";
import { auth, db } from "@/services/firbase"; 
export default function HomeScreen() {
  const router = useRouter();
  // const posts = [
  //   {
  //     id: 1,
  //     title: "Mastering React Native in 2026",
  //     category: "Coding",
  //     author: "Jane Doe",
  //     time: "2 min read",
  //     image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=500",
  //   },
  //   {
  //     id: 2,
  //     title: "The Future of Minimalist Design",
  //     category: "Design",
  //     author: "Alex Post",
  //     time: "5 min read",
  //     image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=500",
  //   },
  //   {
  //     id: 3,
  //     title: "10 Tips for Better Typography",
  //     category: "Writing",
  //     author: "Sam Smith",
  //     time: "4 min read",
  //     image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=500",
  //   },
  //   {
  //     id: 4,
  //     title: "Setup your workspace for Productivity",
  //     category: "Tech",
  //     author: "Mike Ross",
  //     time: "3 min read",
  //     image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500",
  //   }
  // ];

  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);


  useEffect(() => {
  const fetchPostsAndProfile = async () => {
    try {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postsData);

      const user = auth.currentUser;
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

    } catch (error) {
      console.log("Error loading home data:", error);
    }
  };

  fetchPostsAndProfile();
}, []);

  



  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-slate-100">
        <View>
          <Text className="text-slate-500 text-xs font-bold tracking-widest">WELCOME BACK</Text>
          <Text className="text-slate-900 text-xl font-black">Hi, Dev User  {userName} 👋</Text>
        </View>
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-teal-100 items-center justify-center border border-teal-200 overflow-hidden"
          onPress={() => router.push("/profile")}
        >
          {profileImage ? (
            <Image 
              source={{ uri: profileImage }} 
              className="w-full h-full" 
            />
          ) : (
            <Text className="text-teal-700 font-bold">
              {userName.charAt(0).toUpperCase()}
            </Text>
          )}
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

      
        <View className="px-6">
          {posts.map((post) => (
            <TouchableOpacity 
              key={post.id} 
              activeOpacity={0.9}
              className="bg-white rounded-[25px] mb-5 overflow-hidden border border-slate-100 shadow-sm shadow-slate-200"
            >
              <Image
                source={{
                  uri: post.imageBase64?.startsWith("data:image")
                        ? post.imageBase64
                        : `data:image/jpeg;base64,${post.imageBase64}`,
                }}
                className="w-full h-44"
                resizeMode="cover"
              />
              
              <View className="p-4">
                <View className="flex-row justify-between items-center mb-2">
                  <View className="bg-teal-50 px-3 py-1 rounded-lg">
                    <Text className="text-teal-600 text-[10px] font-black uppercase">{post.category}</Text>
                  </View>
                  <Text className="text-slate-400 text-xs">{post.createdAt?.seconds
                    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
                    : "Just now"}
                  </Text>
                </View>

                <Text className="text-slate-900 font-black text-lg mb-3">
                  {post.title}
                </Text>
                <Text className="font-semibold text-base text-slate-800">
                  {post.content}
                </Text>

                <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-slate-50">
                  <View className="flex-row items-center">
                    <Text className="text-slate-600 font-bold text-xs">{post.author}</Text>
                  </View>

                  <View className="flex-row items-center">
                    <TouchableOpacity className="mr-4 flex-row items-center">
                      <Ionicons name="heart-outline" size={20} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Ionicons name="bookmark-outline" size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      <TouchableOpacity className="absolute bottom-8 right-8 w-14 h-14 bg-teal-600 rounded-full items-center justify-center shadow-xl shadow-teal-600/50"
        onPress={()=>router.push("/create")}
        activeOpacity={0.7}
      >
        <Feather name="plus" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}