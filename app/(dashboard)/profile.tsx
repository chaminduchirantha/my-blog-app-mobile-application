import { auth, db } from "@/services/firbase";
import { deletePost, updatePost } from "@/services/postService";
import { Ionicons } from "@expo/vector-icons";
import { updateEmail, updateProfile } from "@firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const user = auth.currentUser;

  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [postCount, setPostCount] = useState(0);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [userName, setUserName] = useState<string>("");
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || "light");
  const isDark = theme === "dark";
  const [newName, setNewName] = useState(userName);
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");

  interface Post {
    id: string;
    title: string;
    content: string;
    createdAt?: any;
    imageBase64?: string | null;
    category?: string;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const displayImage = data.profileImageBase64
          ? `data:image/jpeg;base64,${data.profileImageBase64}`
          : data.photoURL || null;
        setProfileImage(displayImage);
        setUserName(data.name || "User");
      }

      try {
        const q = query(
          collection(db, "posts"),
          where("userId", "==", user.uid),
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
    if (!user) return;

    try {
      const photoURL =
        profileImage && !newProfileImage
          ? profileImage
          : "https://via.placeholder.com/150";

      await updateProfile(user, {
        displayName: newName,
        photoURL: photoURL || undefined,
      });

      if (newEmail !== user.email) {
        await updateEmail(user, newEmail);
      }

      const userDocRef = doc(db, "users", user.uid);
      const updateData: any = {
        name: newName,
        email: newEmail,
        photoURL: photoURL,
        updatedAt: new Date(),
      };

      if (newProfileImage) {
        updateData.profileImageBase64 = newProfileImage;
      }

      await updateDoc(userDocRef, updateData);

      setUserName(newName);
      if (newProfileImage) {
        setProfileImage(`data:image/jpeg;base64,${newProfileImage}`);
      } else {
        setProfileImage(photoURL);
      }
      setNewProfileImage(null);

      setModalVisible(false);
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.log("Error updating profile:", error);
      alert(error.message);
    }
  };

  const openEditModal = () => {
    setNewName(userName);
    setNewEmail(user?.email || "");
    setModalVisible(true);
  };

  const openEditPostModal = (post: Post) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category || "");
    setEditModalVisible(true);
  };

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setNewProfileImage(result.assets[0].base64);
    }
  };

  const handleUpdatePost = async () => {
    if (!selectedPost) return;

    await updatePost(
      selectedPost.id,
      editTitle,
      // "author",/
      editCategory,
      editContent,
      
    );

    setMyPosts((prev) =>
      prev.map((p) =>
        p.id === selectedPost.id
          ? { ...p, title: editTitle, content: editContent, category: editCategory }
          : p
      )
    );
    alert("Post updated successfully!");

    setEditModalVisible(false);
  };


  const handleDeletePost = (postId: string) => {
    Alert.alert("Delete Post","Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deletePost(postId);
            setMyPosts((prev) => prev.filter((p) => p.id !== postId));
            setPostCount((c) => c - 1);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          className={`pt-12 pb-4 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}
        >
          <View className="px-6 flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-teal-500 text-[10px] font-black tracking-[2px]">
                HELLO
              </Text>
              <Text
                className={`${isDark ? "text-white" : "text-slate-900"} text-xl font-bold`}
              >
                {userName} 👋
              </Text>
            </View>

            <View className="flex-row items-center gap-x-3">
              <TouchableOpacity
                onPress={() => setTheme(isDark ? "light" : "dark")}
                className={`p-2.5 rounded-2xl ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200"}`}
              >
                <Ionicons
                  name={isDark ? "sunny" : "moon"}
                  size={26}
                  color={isDark ? "#fbbf24" : "#64748b"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-16 h-16 rounded-full border-2 border-teal-500/30 overflow-hidden"
                onPress={() => router.push("/profile")}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="bg-teal-500 w-full h-full items-center justify-center">
                    <Text className="text-white font-bold">
                      {userName?.charAt(0) || "U"}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="items-center mt-8">
          {profileImage && (
            <Image
              source={{ uri: profileImage }}
              className="w-32 h-32 rounded-full"
            />
          )}
          <Text
            className={`text-xl font-bold mt-4 ${isDark ? "text-white" : "text-black"}`}
          >
            {user?.displayName || "No Name"}
          </Text>
          <Text
            className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {user?.email} | Blogger ✍️
          </Text>
        </View>

        <View className="flex-row justify-around mt-8">
          <View className="items-center">
            <Text
              className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}
            >
              {postCount}
            </Text>
            <Text
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Post count
            </Text>
          </View>
        </View>

        <View className="flex-row justify-center gap-4 mt-8">
          <TouchableOpacity
            className="bg-teal-600 px-6 py-3 rounded-xl"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white font-semibold">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 px-6 py-3 rounded-xl"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-white font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-10">
          <Text
            className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}
          >
            My Posts
          </Text>

          {myPosts.length > 0 ? (
            myPosts.map((post) => (
              <View
                key={post.id}
                className={`p-4 rounded-xl mb-3 shadow-sm ${isDark ? "bg-slate-800" : "bg-gray-100"}`}
              >
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
                  <View
                    className={`w-20 h-20 rounded-2xl items-center justify-center ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
                  >
                    <Text
                      className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                    >
                      No image{" "}
                    </Text>
                  </View>
                )}
                <View className="absolute top-2 right-2 flex-row gap-3 z-10">

                  {/* UPDATE */}
                  <TouchableOpacity onPress={() => openEditPostModal(post)}>
                    <Ionicons name="create" size={25} color="#22c55e" />
                  </TouchableOpacity>

                  {/* DELETE */}
                  <TouchableOpacity onPress={() => alert(handleDeletePost(post.id))}>
                    <Ionicons name="trash" size={24} color="#ef4444" />
                  </TouchableOpacity>

                </View>
                <Text
                  className={`font-semibold text-base ${isDark ? "text-slate-100" : "text-slate-800"}`}
                >
                  {post.title}
                </Text>
                <Text
                  className={`font-semibold text-base ${isDark ? "text-slate-100" : "text-slate-800"}`}
                >
                  {post.content}
                </Text>
                <Text
                  className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {post.createdAt
                    ? new Date(
                        post.createdAt.seconds * 1000,
                      ).toLocaleDateString()
                    : "Just now"}
                </Text>
              </View>
            ))
          ) : (
            <Text
              className={`text-center mt-4 italic ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              You haven't posted anything yet.
            </Text>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-6 left-4 right-4">
        <View
          className={`flex-row items-center justify-around py-3 rounded-3xl shadow-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
        >
          <TouchableOpacity
            className="items-center px-4"
            onPress={() => router.push("/home")}
          >
            <Ionicons
              name="home-outline"
              size={24}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
            <Text
              className={`text-[10px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center px-4"
            onPress={() => router.push("/bookmarks")}
          >
            <Ionicons
              name="bookmark-outline"
              size={24}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
            <Text
              className={`text-[10px] font-bold mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Saved
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/create")}
            className={`w-14 h-14 bg-teal-600 rounded-full items-center justify-center -mt-10 shadow-lg ${isDark ? "border border-slate-950" : ""}`}
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center px-4"
            onPress={() => router.push("/topics")}
          >
            <Ionicons
              name="search-outline"
              size={24}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
            <Text
              className={`text-[10px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Explore
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center px-4"
            onPress={() => router.push("/profile")}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
            <Text
              className={`text-[10px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          className={`flex-1 justify-center px-6 ${isDark ? "bg-black/70" : "bg-black/50"}`}
        >
          <View
            className={`rounded-2xl p-6 ${isDark ? "bg-slate-800" : "bg-white"}`}
          >
            <Text
              className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}
              onPress={openEditModal}
            >
              Edit Profile
            </Text>

            <Text
              className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Name
            </Text>

            <TextInput
              placeholder="Enter your new name"
              placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
              className={`border rounded-xl px-4 py-3 mb-4 ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-black"}`}
              value={newName}
              onChangeText={setNewName}
            />

            <Text
              className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              email
            </Text>

            <TextInput
              value={user?.email || ""}
              editable={false}
              className={`border rounded-xl px-4 py-3 mb-4 opacity-60 ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-gray-100 border-gray-300 text-black"
              }`}
            />

            <TouchableOpacity
              onPress={pickProfileImage}
              className="items-center mb-4"
            >
              {newProfileImage || profileImage ? (
                <Image
                  source={{
                    uri: newProfileImage
                      ? `data:image/jpeg;base64,${newProfileImage}`
                      : profileImage!,
                  }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <View className="w-24 h-24 rounded-full bg-teal-500 items-center justify-center">
                  <Text className="text-white font-bold">
                    {userName?.charAt(0) || "U"}
                  </Text>
                </View>
              )}

              <Text className="text-teal-500 mt-2 text-sm">Change Photo</Text>
            </TouchableOpacity>

            <View className="flex-row justify-end gap-3">
              <TouchableOpacity className="px-4 py-2">
                <Text
                  className={`font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  onPress={() => setModalVisible(false)}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-teal-600 px-5 py-2 rounded-xl"
                onPress={handleSave}
              >
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={editModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center bg-black/60 px-6">
          <View className="bg-white rounded-2xl p-5">

            <Text className="text-lg font-bold mb-4">Update Post</Text>

            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Title"
              className="border rounded-xl px-4 py-2 mb-3"
            />

            <TextInput
              value={editCategory}
              onChangeText={setEditCategory}
              placeholder="Category"
              className="border rounded-xl px-4 py-2 mb-3"
            />

            <TextInput
              value={editContent}
              onChangeText={setEditContent}
              placeholder="Content"
              multiline
              className="border rounded-xl px-4 py-2 h-28 mb-4"
            />

            <View className="flex-row justify-end gap-3">
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text className="text-gray-500">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-teal-600 px-5 py-2 rounded-xl"
                onPress={handleUpdatePost}
              >
                <Text className="text-white font-semibold">Update</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
