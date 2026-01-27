// app/(auth)/_layout.tsx
import React from "react";
import { Slot, Stack } from "expo-router";
import Toast from "react-native-toast-message";


export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* Slot automatically renders the nested screens (login.tsx, register.tsx) */}
      <Slot />
      <Toast/>
    </Stack>
  );
}
