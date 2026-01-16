import React from 'react';
import { View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const tabs = [
  { name: 'home', icon: 'home-outline', activeIcon: 'home', title: 'Feed' },
  { name: 'explore', icon: 'search-outline', activeIcon: 'search', title: 'Explore' },
  { name: 'create', icon: 'add-circle-outline', activeIcon: 'add-circle', title: 'Write' },
  { name: 'bookmarks', icon: 'bookmark-outline', activeIcon: 'bookmark', title: 'Saved' },
  { name: 'profile', icon: 'person-outline', activeIcon: 'person', title: 'Profile' },
] as const;

const DashboardLayout = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
        <View style={{ height: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#0d9488', width: 35, height: 35, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>D</Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#1e293b', letterSpacing: -0.5 }}>DEV POST</Text>
          </View>

         

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             <TouchableOpacity style={{ marginRight: 15 }}>
                <Ionicons name="notifications-outline" size={24} color="#64748b" />
             </TouchableOpacity>
             <TouchableOpacity>
                <Ionicons name="settings-outline" size={24} color="#64748b" />
             </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0d9488',
          tabBarInactiveTintColor: '#94a3b8',
          
          tabBarPosition: 'top',
          
          tabBarStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
            shadowOpacity: 0, 
            borderBottomWidth: 1,
            borderBottomColor: '#f1f5f9',
            height: 100,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            textTransform: 'capitalize',
          },
        }} 
      >   
        {tabs.map((tab) => ( 
          <Tabs.Screen 
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color, focused }) => (
                <Ionicons 
                  name={focused ? tab.activeIcon : tab.icon} 
                  size={20} 
                  color={color} 
                />
              )
            }}
          />
        ))}
      </Tabs>
    </View>
  );
};

export default DashboardLayout;