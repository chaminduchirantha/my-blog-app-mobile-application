import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StatusBar ,StyleSheet, useColorScheme  } from 'react-native';
import { router, Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DashboardLayout = () => {
 const [showSettingsMenu, setShowSettingsMenu] = useState(false);
 const systemTheme = useColorScheme();
 const [theme, setTheme] = useState(systemTheme || "light");

 const isDark = theme === "dark";
 const toggleSettingsMenu = () => setShowSettingsMenu(!showSettingsMenu);

  const tabs = [
    { name: 'home', icon: 'home-outline', activeIcon: 'home', title: 'Feed' },
    { name: 'topics', icon: 'search-outline', activeIcon: 'search', title: 'Topics' },
    { name: 'create', icon: 'add-circle-outline', activeIcon: 'add-circle', title: 'Write' },
    { name: 'bookmarks', icon: 'bookmark-outline', activeIcon: 'bookmark', title: 'Saved' },
    { name: 'profile', icon: 'person-outline', activeIcon: 'person', title: 'Profile' },
  ] as const;

 

  const handleProfile = () => {
    console.log("Go to Profile");
    router.push("/(dashboard)/profile");
    setShowSettingsMenu(false);
  };

  const handleLogout = () => {
    console.log("Logout user");
    router.replace("/(auth)/login");
    setShowSettingsMenu(false);
  };
  


  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
     <SafeAreaView edges={['top']} className="bg-slate-700">
        <View className="h-[70px] flex-row items-center justify-between px-5 border-b border-slate-200">
          
          {/* Left: Logo + Title */}
          <View className="flex-row items-center">
            <View className="bg-teal-600 w-[35px] h-[35px] rounded-[10px] items-center justify-center mr-2.5">
              <Text className={`text-white font-bold text-lg}`}>D</Text>
            </View>
            <Text className="text-xl font-extrabold text-slate-100 tracking-tight">
              DEV POST
            </Text>
          </View>

          <View className="flex-row items-center">
            
            <TouchableOpacity className="mr-4">
              <Ionicons name="notifications-outline" size={24} color="#ffff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleSettingsMenu}>
              <Ionicons name="settings-outline" size={24} color="#ffff" />
            </TouchableOpacity>
          
            {showSettingsMenu && (
              <View className="absolute top-25 right-0 bg-white border border-white rounded-lg shadow-lg w-32">
                <TouchableOpacity
                  onPress={handleProfile}
                  className="px-4 py-3 border-b border-white"
                >
                  <Text className="text-slate-700">Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogout}
                  className="px-4 py-3"
                >
                  <Text className="text-red-500">Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>


      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0d9488',
          tabBarInactiveTintColor: '#ffff',
          
          tabBarPosition: 'top',
          
          tabBarStyle: {
            backgroundColor: '#364153',
            elevation: 0,
            shadowOpacity: 0, 
            height: 100,
            zIndex: 1000,
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

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: -95,
    right: 0,
    width: 140,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    paddingVertical: 5,
    zIndex: 100000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
});


export default DashboardLayout;