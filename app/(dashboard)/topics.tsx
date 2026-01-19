import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const topics = [
  { id: 1, name: 'React Native', posts: 120 },
  { id: 2, name: 'Firebase', posts: 98 },
  { id: 3, name: 'Java', posts: 150 },
  { id: 4, name: 'Web Development', posts: 210 },
  { id: 5, name: 'UI / UX', posts: 65 },
  { id: 6, name: 'AI & ML', posts: 42 },
  { id: 7, name: 'Backend', posts: 89 },
  { id: 8, name: 'Databases', posts: 73 },
];

export default function TopicsPage() {
  return (
    <ScrollView
      className="flex-1 bg-white px-4 pt-4"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-2xl font-extrabold text-slate-800 mb-4">
        Topics
      </Text>

      <View className="flex-row items-center bg-slate-100 rounded-xl px-4 py-3 mb-6">
        <Ionicons name="search-outline" size={20} color="#64748b" />
        <TextInput
          placeholder="Search topics..."
          placeholderTextColor="#94a3b8"
          className="ml-3 flex-1 text-slate-800"
        />
      </View>

      <View>
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            activeOpacity={0.85}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4"
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-extrabold text-slate-800">
                  {topic.name}
                </Text>
                <Text className="text-sm text-slate-500 mt-1">
                  {topic.posts} posts
                </Text>
              </View>

              <View className="bg-teal-600 px-4 py-2 rounded-xl">
                <Text className="text-white text-sm font-bold">
                  View
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
