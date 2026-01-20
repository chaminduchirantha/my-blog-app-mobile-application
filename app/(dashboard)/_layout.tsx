import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StatusBar ,StyleSheet  } from 'react-native';
import { router, Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DashboardLayout = () => {
 const [showSettingsMenu, setShowSettingsMenu] = useState(false);

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
             <TouchableOpacity onPress={toggleSettingsMenu}>
                <Ionicons name="settings-outline" size={24} color="#64748b" />
             </TouchableOpacity>

             
             {showSettingsMenu && (
               <View style={styles.dropdown}>
                 <TouchableOpacity onPress={handleProfile} style={styles.dropdownItem}>
                   <Text>Profile</Text>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
                   <Text>Logout</Text>
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
          tabBarInactiveTintColor: '#94a3b8',
          
          tabBarPosition: 'top',
          
          tabBarStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
            shadowOpacity: 0, 
            borderBottomWidth: 1,
            borderBottomColor: '#f1f5f9',
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
    top: -65,
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