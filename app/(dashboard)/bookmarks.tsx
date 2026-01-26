import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { auth, db } from "@/services/firbase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export default function BookmarksScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;

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

  const handleImageLoadStart = (postId: string) => {
    setLoadingImages(prev => ({ ...prev, [postId]: true }));
  };

  const handleImageLoadEnd = (postId: string) => {
    setLoadingImages(prev => ({ ...prev, [postId]: false }));
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#00bba7" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-extrabold mb-6">
        Bookmarks
      </Text>

      {posts.length === 0 ? (
        <Text className="text-center text-slate-500 mt-20">
          No bookmarked posts yet
        </Text>
      ) : (
        posts.map((post) => (
          <View
            key={post.id}
            className="bg-white rounded-3xl mb-6 overflow-hidden border border-slate-200"
          >
            {post.imageBase64 && (
              <View className="w-full h-38 bg-slate-100 justify-center items-center">
                {loadingImages[post.id] && (
                  <ActivityIndicator size="small" color="#6366f1" />
                )}
                <Image
                  source={{
                    uri: post.imageBase64?.startsWith("data:image")
                      ? post.imageBase64
                      : `data:image/jpeg;base64,${post.imageBase64}`,
                  }}
                  className="w-full h-80"
                  resizeMode="cover"
                />
              </View>
            )}

            <View className="p-4">
              <Text className="text-lg font-bold mb-1">
                {post.author}
              </Text>

              <Text className="text-xs text-teal-500 mb-2">
                {post.category}
              </Text>

              <Text
                numberOfLines={4}
                className="text-slate-700 leading-5"
              >
                {post.content}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}