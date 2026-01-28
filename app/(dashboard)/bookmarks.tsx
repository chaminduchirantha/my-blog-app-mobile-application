import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, useColorScheme } from "react-native";
import { auth, db } from "@/services/firbase";
import { collection, doc, getDoc, getDocs , query ,orderBy } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookmarksScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState<{[key: string]: boolean}>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const toggleExpand = (postId: string) => {
    setIsExpanded((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const user = auth.currentUser;
  const [userName, setUserName] = useState("User");
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || "light");
  const isDark = theme === "dark";
  const router = useRouter();
  
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
          if (data.profileImageBase64) {
            setProfileImage(
              data.profileImageBase64.startsWith("data:image")
                ? data.profileImageBase64
                : `data:image/jpeg;base64,${data.profileImageBase64}`
            );
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

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      if (!user) return;

      try {
        const postsSnapshot = await getDocs(collection(db, "posts"));
        const bookmarkedPosts: any[] = [];

        for (const postDoc of postsSnapshot.docs) {
          const bookmarkRef = doc(
            db,
            "posts",
            postDoc.id,
            "bookmarks",
            user.uid
          );

          const bookmarkSnap = await getDoc(bookmarkRef);

          if (bookmarkSnap.exists()) {
            bookmarkedPosts.push({
              id: postDoc.id,
              ...postDoc.data(),
            });
          }
        }

        setPosts(bookmarkedPosts);
      } catch (error) {
        console.log("Error loading bookmarks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkedPosts();
  }, []);

 
  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#00bba7" />
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <View className={`px-6 pt-4 pb-4 flex-row justify-between items-center ${isDark ? "bg-slate-950" : "bg-white"}`}>
        <View>
          <Text className="text-teal-500 text-[10px] font-black tracking-[2px]">BOOKMARKS</Text>
          <Text className={`${isDark ? "text-white" : "text-slate-900"} text-xl font-bold`}>
            Saved Posts
          </Text>
        </View>

        <View className="flex-row items-center gap-x-3">
          <TouchableOpacity
            onPress={() => setTheme(isDark ? "light" : "dark")}
            className={`p-2.5 rounded-2xl ${isDark ? "bg-slate-900 border border-slate-800" : "bg-slate-100 border border-slate-200"}`}
          >
            <Ionicons name={isDark ? "sunny" : "moon"} size={26} color={isDark ? "#fbbf24" : "#64748b"} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-16 h-16 rounded-full border-2 border-teal-500/30 overflow-hidden"
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

      <ScrollView className="flex-1 px-4">
        {posts.length === 0 ? (
          <View className="mt-20 items-center">
            <Ionicons name="bookmark-outline" size={60} color="#cbd5e1" />
            <Text className="text-slate-500 mt-4 font-medium">No bookmarked posts yet</Text>
          </View>
        ) : (
          posts.map((post) => (
            <View key={post.id} className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} rounded-3xl mb-6 overflow-hidden border`}>
              {post.imageBase64 && (
                <Image
                  source={{ uri: post.imageBase64.includes("data:image") ? post.imageBase64 : `data:image/jpeg;base64,${post.imageBase64}` }}
                  className="w-full h-60"
                  resizeMode="cover"
                />
              )}
              <View className="p-4">
                <Text className="text-xs text-teal-500 font-bold mb-1 uppercase tracking-wider">{post.category}</Text>
                <Text className={`${isDark ? "text-white" : "text-slate-900"} text-md font-bold mb-2`}>{post.author}</Text>

                <Text className={`${isDark ? "text-white" : "text-slate-900"} text-2xl font-serif font-bold mb-2`}>{post.title}</Text>
                
                <Text 
                  className={`${isDark ? "text-slate-400" : "text-slate-800"} text-[14px] leading-5  font-serif`}
                  numberOfLines={isExpanded[post.id] ? undefined : 10}
                >
                  {post.content}
                </Text>
                
                {post.content?.length > 100 && (
                  <TouchableOpacity onPress={() => toggleExpand(post.id)} className="mt-2">
                    <Text className="text-teal-600 font-bold">{isExpanded[post.id] ? "Show Less" : "See More..."}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
        <View className="h-24" />
      </ScrollView>

      <View className="absolute bottom-4 left-4 right-4">
        <View className={`${isDark ? "bg-slate-900" : "bg-slate-200"} flex-row items-center justify-around py-4 rounded-b-3xl shadow-xl border ${isDark ? "border-slate-900" : "border-slate-100"}`}>
          <TouchableOpacity className="items-center px-4" onPress={() => router.push("/home")}>
            <Ionicons name="home-outline" size={24} color="#64748b" />
            <Text className="text-[10px] text-slate-500 mt-1">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center px-4" onPress={() => router.push("/bookmarks")}>
            <Ionicons name="bookmark" size={24} color="#0d9488" />
            <Text className="text-[10px] text-teal-600 font-bold mt-1">Saved</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push("/create")}
            className="w-14 h-14 bg-teal-600 rounded-full items-center justify-center -mt-12 shadow-lg dark:border-slate-950"
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