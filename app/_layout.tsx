import { View, Text } from "react-native"
import React from "react"
import { Slot } from "expo-router"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import Toast from "react-native-toast-message";

// App.tsx ->
const RootLayout = () => {
  const insets = useSafeAreaInsets()

  console.log(insets)

  return (
    <View style={{ marginTop: insets.top, flex: 1 }}>
      <Slot />
      <Toast />
    </View>
  )
}

export default RootLayout
