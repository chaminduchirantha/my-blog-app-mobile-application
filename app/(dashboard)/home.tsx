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
  const [bookmarks, setBookmarks] = useState<{[key: string]: { saved: boolean , count: number };}>({});

  
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

        await fetchLikesForPosts(postsData);
        await fetchBookmarksForPosts(postsData);
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

  const fetchBookmarksForPosts = async (postsData: any[]) => {
    try {
      if (!user) return;

      const bookmarkData: { [key: string]: { saved: boolean; count: number } } = {};

      for (const post of postsData) {
        const bookmarksRef = collection(
          db,
          "posts",
          post.id,
          "bookmarks"
        );

        const bookmarksSnap = await getDocs(bookmarksRef);

        const userBookmarkRef = doc(
          db,
          "posts",
          post.id,
          "bookmarks",
          user.uid
        );

        const userBookmarkSnap = await getDoc(userBookmarkRef);

        bookmarkData[post.id] = {
          saved: userBookmarkSnap.exists(),
          count: bookmarksSnap.size, 
        };
      }

      setBookmarks(bookmarkData);
    } catch (error) {
      console.log("Error fetching bookmarks:", error);
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

  
  const handleBookmark = async (postId: string) => {
    try {
      if (!user) return;

      const bookmarkRef = doc(
        db,
        "posts",
        postId,
        "bookmarks",
        user.uid
      );

      const isSaved = bookmarks[postId]?.saved;

      if (isSaved) {
        await deleteDoc(bookmarkRef); 
      } else {
        await setDoc(bookmarkRef, {
          userId: user.uid,
          savedAt: Timestamp.now(),
        });
      }

      setBookmarks((prev) => {
      const postBookmark = prev[postId];

      return {
          ...prev,
          [postId]: {
            saved: !isSaved,
            count: isSaved
              ? postBookmark.count - 1
              : postBookmark.count + 1,
          },
        };
      });
    } catch (error) {
      console.log("Error handling bookmark:", error);
    }
  };



  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
      <View className={`pt-12 pb-4 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        
        <View className="px-6 flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-teal-500 text-[10px] font-black tracking-[2px]">HELLO WELLCOME</Text>
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

        <View className="px-4">
          <View
            className={`flex-row items-center justify-between px-0 py-4 rounded-2xl
            ${isDark ? "bg-slate-900" : "bg-slate-200/50"}`}
          >
            <TouchableOpacity
              className="items-center flex-1"
              onPress={() => router.push("/")}
            >
              <Ionicons name="home" size={24} color="#10b981" />
              <Text className="text-xs text-teal-500">Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center flex-1"
              onPress={() => router.push("/bookmarks")}
            >
              <Ionicons name="bookmark-outline" size={24} color="#64748b" />
              <Text className="text-xs text-slate-500">Saved</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/create")}
              className="w-14 h-14 bg-teal-600 rounded-full items-center justify-center -mt-8 shadow-lg"
            >
              <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center flex-1"
              onPress={() => router.push("/topics")}
            >
              <Ionicons name="search-outline" size={24} color="#64748b" />
              <Text className="text-xs text-slate-500">Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center flex-1"
              onPress={() => router.push("/profile")}
            >
              <Ionicons name="person-outline" size={24} color="#64748b" />
              <Text className="text-xs text-slate-500">Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
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
          <Text className={`${isDark ? "text-slate-100" : "text-slate-900"} text-lg font-bold mb-4`}>
            Categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {["All", "Design", "Coding", "Writing", "Tech"].map(
              (cat, index) => (
                <TouchableOpacity
                  key={index}
                  className={`mr-3 px-5 py-2.5 rounded-xl ${
                    index === 0
                      ? "bg-teal-600"
                      : isDark
                      ? "bg-slate-800 border border-slate-700"
                      : "bg-white border border-slate-200"
                    }
                  `}>
                  <Text
                    className={`font-bold ${
                      index === 0
                        ? "text-white"
                        : isDark
                        ? "text-slate-300"
                        : "text-slate-500"
                      }
                    `}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </ScrollView>
        </View>

        <View className="px-6">
          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              activeOpacity={0.9}
              className={`${isDark ? "bg-slate-800" : "bg-white"} mb-5 overflow-hidden rounded-2xl shadow-sm shadow-slate-200`}
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
                <View className="flex-row justify-between items-center mb-8">
                  <View className="bg-teal-50 px-3 py-1 rounded-lg">
                    <Text className="text-teal-600 text-[10px] font-black uppercase">
                      {post.category}
                    </Text>
                  </View>
                  <Text className="text-slate-400 text-xs">
                    

                  </Text>
                </View>

                <View className="px-3 pb-3">
                  <Text className={`${isDark ? "text-slate-100" : "text-slate-900"} font-bold text-2xl font-serif  mb-1`}>
                    {post.title}
                  </Text>
                  <Text
                    className={`${isDark ? "text-slate-100" : "text-slate-800"} text-[14px] font-serif leading-5`}
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
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2" onPress={() => handleBookmark(post.id)}>
                      <Ionicons
                        name={bookmarks[post.id]?.saved ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={bookmarks[post.id]?.saved ? "#10b981" : "#64748b"}
                      />
                      <Text className="ml-2 text-slate-500 font-semibold">
                         {bookmarks[post.id]?.count || 0}
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
