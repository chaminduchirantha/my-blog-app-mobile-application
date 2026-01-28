import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

const topics = [
  { id: 2, name: "React" },
  { id: 1, name: "React Native"},
  { id: 3, name: "Mern Stack"},
  { id: 4, name: "Java"},
  { id: 5, name: "Web Development"},
  { id: 6, name: "UI / UX"},
  { id: 7, name: "AI & ML"},
  { id: 8, name: "Backend"},
  { id: 9, name: "Databases"},
  { id: 10, name: "Firebase"},
];

const articles = [
  {
    id: 2,
    topic: "React",
    title: "Building Scalable React Native Apps",
    author: "John Doe",
    image: "https://framerusercontent.com/images/N0xefN2fE6CCF4G2YhAg5exTHX8.png",
    excerpt:
      "Learn how to structure and build scalable React Native applications with best practices and performance optimization techniques.",
    category: "Tutorial",
  },
  {
    id: 1,
    topic: "React Native",
    title: "Building Scalable React Native Apps",
    author: "John Doe",
    image: "https://www.iquest.cz/_next/image?url=%2Ftechnology%2Freact-native.png&w=640&q=75",
    excerpt:
      "Learn how to structure and build scalable React Native applications with best practices and performance optimization techniques.",
    category: "Tutorial",
  },

  
  {
    id: 3,
    topic: "Firebase",
    title: "Firebase Real-time Database Guide",
    author: "Jane Smith",
    image: "https://www.okoone.com/wp-content/uploads/2024/06/firebase-logo.png",
    excerpt:
      "Complete guide to Firebase Real-time Database including setup, security rules, and advanced features.",
    category: "Guide",
  },
  {
    id: 4,
    topic: "Web Development",
    title: "Modern Web Development Stack 2024",
    author: "Mike Johnson",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRl_6AuG1TxzQdGmZSN4pF02iLepIl6-4ucQ&s",
    excerpt:
      "Explore the latest technologies and frameworks for modern web development in 2024.",
    category: "News",
  },
  {
    id: 5,
    topic: "AI & ML",
    title: "Introduction to Machine Learning",
    author: "Sarah Williams",
    image: "data:image/png;base64,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",
    excerpt:
      "A beginner-friendly introduction to machine learning concepts and practical applications.",
    category: "Educational",
  },
];

export default function TopicsPage() {
  const router = useRouter();
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || "light");
  const isDark = theme === "dark";
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const filteredArticles = selectedTopic
    ? articles.filter(
        (article) =>
          topics.find((t) => t.id === selectedTopic)?.name === article.topic,
      )
    : articles;

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-slate-900" : "bg-white"}`}>
      {/* Header */}
      <View className={`pt-12 pb-4 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <View className="px-6 flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-teal-500 text-[10px] font-black tracking-[2px]">
              EXPLORE
            </Text>
            <Text
              className={`${isDark ? "text-white" : "text-slate-900"} text-xl font-bold`}
            >
              Topics & Articles
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
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

        <View className="px-6 mt-6 ">
        <Text className="text-slate-500 text-md leading-5 mb-6 text-left">
          This section contains topic-based articles only. You can read and publish
          articles under the available topics listed below. Posting content outside
          these topics is not allowed, ensuring all articles stay relevant and well
          organized for the community.By following this approach, users can easily discover relevant content and engage in discussions that align with their interests.
        </Text>
        </View>
        

      
        <View className="px-6 mb-6">
          <Text
            className={`${isDark ? "text-white" : "text-slate-900"} text-lg font-bold mb-4`}
          >
            Topics
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {topics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                onPress={() =>
                  setSelectedTopic(selectedTopic === topic.id ? null : topic.id)
                }
                activeOpacity={0.85}
                className={`mr-3 px-5 py-2.5 rounded-2xl border ${
                  selectedTopic === topic.id
                    ? "bg-teal-600 border-teal-600"
                    : isDark
                      ? "bg-slate-800 border-slate-700"
                      : "bg-slate-50 border-slate-200"
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    selectedTopic === topic.id
                      ? "text-white"
                      : isDark
                        ? "text-slate-300"
                        : "text-slate-500"
                  }`}
                >
                  {topic.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="px-6 pb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={`${isDark ? "text-white" : "text-slate-900"} text-lg font-bold`}
            >
              {selectedTopic ? "Related Articles" : "Latest Articles"}
            </Text>
            {selectedTopic && (
              <TouchableOpacity onPress={() => setSelectedTopic(null)}>
                <Text className="text-teal-600 font-bold text-sm">
                  Clear Filter
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              activeOpacity={0.85}
              className={`${isDark ? "bg-slate-800" : "bg-white"} rounded-2xl overflow-hidden mb-5 shadow-sm border ${isDark ? "border-slate-700" : "border-slate-200"}`}
            >
              {/* Article Image */}
              <Image
                source={{ uri: article.image }}
                className="w-full h-56"
                resizeMode="cover"
              />

              <View className="p-4">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="bg-teal-50 px-3 py-1 rounded-lg">
                    <Text className="text-teal-600 text-[10px] font-black uppercase">
                      {article.category}
                    </Text>
                  </View>
                  <Text
                    className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {article.topic}
                  </Text>
                </View>

                <Text
                  className={`${isDark ? "text-white" : "text-slate-900"} text-lg font-bold font-serif mb-2`}
                >
                  {article.title}
                </Text>

                <Text
                  className={`${isDark ? "text-slate-400" : "text-slate-700"} text-[13px] leading-5 font-serif mb-3`}
                  numberOfLines={2}
                >
                  {article.excerpt}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <View className="h-24" />
        </View>
      </ScrollView>

      <View className="absolute bottom-6 left-4 right-4">
        <View
          className={`${isDark ? "bg-slate-900" : "bg-white"} flex-row items-center justify-around py-3 rounded-3xl shadow-xl border ${isDark ? "border-slate-800" : "border-slate-100"}`}
        >
          <TouchableOpacity
            className="items-center px-4"
            onPress={() => router.push("/home")}
          >
            <Ionicons name="home-outline" size={24} color="#64748b" />
            <Text className="text-[10px] text-slate-500 mt-1">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center px-4"
            onPress={() => router.push("/bookmarks")}
          >
            <Ionicons name="bookmark-outline" size={24} color="#64748b" />
            <Text className="text-[10px] text-slate-500 mt-1">Saved</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/create")}
            className="w-14 h-14 bg-teal-600 rounded-full items-center justify-center -mt-10 shadow-lg"
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center px-4"
            onPress={() => router.push("/topics")}
          >
            <Ionicons name="search" size={24} color="#0d9488" />
            <Text className="text-[10px] text-teal-600 font-bold mt-1">
              Explore
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center px-4"
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="person-outline" size={24} color="#64748b" />
            <Text className="text-[10px] text-slate-500 mt-1">Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
