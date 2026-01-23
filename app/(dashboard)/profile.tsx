import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "@/services/firbase";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { doc, getDoc ,query,collection,where,getDocs } from "firebase/firestore";



export default function ProfileScreen() {
    const user = auth.currentUser;

    const [modalVisible, setModalVisible] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [postCount, setPostCount] = useState(0);
    const [myPosts, setMyPosts] = useState<Post[]>([]);

    interface Post {
      id: string;
      title: string;
      content:string
      createdAt?: any;
      imageBase64?: string | null;
    }

    useEffect(() => {
      const fetchProfile = async () => {
        if (!user) return;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileImage(data.photoURL || null);
        }

        try {
        const q = query(
          collection(db, "posts"), 
          where("userId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        
        const postsArray: Post[] = []; 
        
        querySnapshot.forEach((doc) => {
          postsArray.push({ id: doc.id, ...doc.data() } as Post); 
        });

        setMyPosts(postsArray);
        setPostCount(postsArray.length);
      } catch (error) {
        console.log("Error fetching user posts:", error);
      }
    };
      fetchProfile();
    }, [user]);

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
          {profileImage && (
            <Image
              source={{ uri: profileImage }} 
              className="w-32 h-32 rounded-full"
            />
          )}
          <Text className="text-xl font-bold mt-4">
            {user?.displayName || "No Name"}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            {user?.email} | Blogger ✍️
          </Text>
        </View>


        <View className="flex-row justify-around mt-8">
          <View className="items-center">
            <Text className="text-lg font-bold">{postCount}</Text>
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
          <Text className="text-lg font-bold mb-4">My Posts</Text>

          {myPosts.length > 0 ? (
            myPosts.map((post) => (
              <View key={post.id} className="bg-gray-100 p-4 rounded-xl mb-3 shadow-sm">

                {post.imageBase64 ? (
                  <Image
                  source={{
                      uri: post.imageBase64?.startsWith("data:image")
                        ? post.imageBase64
                        : `data:image/jpeg;base64,${post.imageBase64}`,
                    }}
                    className="w-full h-20 rounded-2xl"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-20 h-20 bg-slate-200 rounded-2xl items-center justify-center">
                    <Text className="text-[10px] text-slate-400">No image </Text>
                  </View>
                )}
                <Text className="font-semibold text-base text-slate-800">
                  {post.title}
                </Text>
                <Text className="font-semibold text-base text-slate-800">
                  {post.content}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-400 text-center mt-4 italic">
              You haven't posted anything yet.
            </Text>
          )}
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
