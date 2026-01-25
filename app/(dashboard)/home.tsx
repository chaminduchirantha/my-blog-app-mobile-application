import { auth, db } from "@/services/firbase";
import { Feather, Ionicons } from "@expo/vector-icons";
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
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  const router = useRouter();

  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setLikes] = useState<{[key: string]: { count: number; liked: boolean };}>({});
  const user = auth.currentUser;
  const systemTheme = useColorScheme();
  
  const [theme, setTheme] = useState(systemTheme || "light");
  
  const isDark = theme === "dark";

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
        await fetchLikesForPosts(postsData);
      } catch (error) {
        console.log("Error loading home data:", error);
      }
    };

    fetchPostsAndProfile();
  }, []);

  useEffect(() => {
    const initLikes = posts.reduce(
      (acc, post) => {
        acc[post.id] = { count: post.likes || 0, liked: false };
        return acc;
      },
      {} as { [key: string]: { count: number; liked: boolean } },
    );

    setLikes(initLikes);
  }, [posts]);

  const fetchLikesForPosts = async (postsData: any[]) => {
    try {
      if (!user) return;

      const likesData: { [key: string]: { count: number; liked: boolean } } ={};

      for (const post of postsData) {
        const likesRef = collection(db, "posts", post.id, "likes");
        const likesSnapshot = await getDocs(likesRef);
        const likeCount = likesSnapshot.size;

        const userLikeRef = doc(db, "posts", post.id, "likes", user.uid);
        const userLikeSnap = await getDoc(userLikeRef);

        likesData[post.id] = {
          count: likeCount,
          liked: userLikeSnap.exists(),
        };
      }

      setLikes(likesData);
    } catch (error) {
      console.log("Error fetching likes:", error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      if (!user) {
        console.log("Please login to like posts");
        return;
      }

      const isCurrentlyLiked = likes[postId]?.liked;
      const userLikeRef = doc(db, "posts", postId, "likes", user.uid);

      if (isCurrentlyLiked) {
        await deleteDoc(userLikeRef);
      } else {
        await setDoc(userLikeRef, {
          userId: user.uid,
          userName: user.displayName || "User",
          createdAt: new Date(),
        });
      }

      setLikes((prev) => {
        const postLike = prev[postId];
        return {
          ...prev,
          [postId]: {
            count: isCurrentlyLiked ? postLike.count - 1 : postLike.count + 1,
            liked: !isCurrentlyLiked,
          },
        };
      });
    } catch (error) {
      console.log("Error handling like:", error);
    }
  };


  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
      <View className={`px-6 py-4 flex-row justify-between items-center border-b border-slate-100${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
        <View>
          <Text className="text-slate-500 text-xs font-bold tracking-widest">
            WELCOME BACK
          </Text>
          <Text className={`${isDark ? "text-slate-100" : "text-slate-900"} text-xl font-black`}>
            Hi, Dev User {userName} 👋
          </Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-teal-100 items-center justify-center border border-teal-200 overflow-hidden"
          onPress={() => router.push("/profile")}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} className="w-full h-full" />
          ) : (
            <Text className="text-teal-700 font-bold">
              {userName.charAt(0).toUpperCase()}
            </Text>
          )}
        </TouchableOpacity>
         <TouchableOpacity
            onPress={() => setTheme(isDark ? "light" : "dark")}
            // className="absolute right-6 top-6"
          >
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={26}
              color={isDark ? "#99a1af" : "#99a1af"}
              style={{ opacity: 0.85 }}
            />
          </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-5">
          <View className={`flex-row items-center ${isDark ? "bg-slate-800" : "bg-white"} px-4 py-3 rounded-2xl border border-slate-200 shadow-sm shadow-slate-200`}>
            <Feather name="search" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Search creative posts..."
              className="flex-1 ml-3 text-slate-900"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View className="px-6 mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
          </ScrollView>
        </View>

        <View className="px-6">
          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              activeOpacity={0.9}
              className={`${isDark ? "bg-slate-800" : "bg-white"} mb-5 overflow-hidden  shadow-sm shadow-slate-200`}
            >
              <View className="flex-row items-center p-3">
                <View className={`w-10 h-10 ${isDark ? "bg-slate-700" : "bg-slate-200"} rounded-full items-center justify-center`}>
                  <Text className={`${isDark ? "text-slate-100" : "text-slate-600"} font-bold`}>
                    {post.author?.charAt(0)}
                  </Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className={`${isDark ? "text-slate-100" : "text-slate-900"} font-bold text-[15px]`}>
                    {post.author}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className={`${isDark ? "text-slate-400" : "text-slate-500"} text-[12px]`}>
                      {post.createdAt}
                    </Text>
                    <Text className={`${isDark ? "text-slate-400" : "text-slate-500"} text-[12px] mx-1`}>•</Text>
                    <Ionicons name="earth" size={12} color="#64748b" />
                  </View>
                </View>
                <TouchableOpacity>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={20}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>

              <Image
                source={{
                  uri: post.imageBase64?.startsWith("data:image")
                    ? post.imageBase64
                    : `data:image/jpeg;base64,${post.imageBase64}`,
                }}
                className="w-full h-80"
                resizeMode="cover"
              />

              <View className="p-4">
                <View className="flex-row justify-between items-center mb-2">
                  <View className="bg-teal-50 px-3 py-1 rounded-lg">
                    <Text className="text-teal-600 text-[10px] font-black uppercase">
                      {post.category}
                    </Text>
                  </View>
                  <Text className="text-slate-400 text-xs">
                    

                  </Text>
                </View>

                <View className="px-3 pb-3">
                  <Text className={`${isDark ? "text-slate-100" : "text-slate-900"} font-bold text-lg mb-1`}>
                    {post.title}
                  </Text>
                  <Text
                    className={`${isDark ? "text-slate-400" : "text-slate-800"} text-[14px] leading-5`}
                    numberOfLines={isExpanded ? undefined : 14}
                  >
                    {post.content}
                  </Text>
                  {post.content?.length > 150 && (
                    <TouchableOpacity
                      onPress={() => setIsExpanded(!isExpanded)}
                      className="mt-1"
                    >
                      <Text className="text-slate-500 font-bold text-[14px]">
                        {isExpanded ? "Show Less" : "See More..."}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-slate-50">
                  <View className="flex-row justify-between px-2 py-1">
                    <TouchableOpacity
                      className="flex-1 flex-row items-center justify-center py-2"
                      onPress={() => handleLike(post.id)}
                    >
                      <Ionicons
                        name={
                          likes[post.id]?.liked
                            ? "thumbs-up"
                            : "thumbs-up-outline"
                        }
                        size={20}
                        color={likes[post.id]?.liked ? "#10b981" : "#64748b"}
                      />
                      <Text className="ml-2 text-slate-500 font-semibold">
                        {likes[post.id]?.count || 0}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2">
                      <Ionicons
                        name="bookmark-outline"
                        size={20}
                        color="#64748b"
                      />
                      <Text className="ml-2 text-slate-500 font-semibold">
                        save
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-8 right-8 w-14 h-14 bg-teal-600 rounded-full items-center justify-center shadow-xl shadow-teal-600/50"
        onPress={() => router.push("/create")}
        activeOpacity={0.7}
      >
        <Feather name="plus" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
