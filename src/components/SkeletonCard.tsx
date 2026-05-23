// src/components/SkeletonCard.tsx
import React from 'react';
import { View } from 'react-native';

export const SkeletonCard = () => {
  return (
    <View className="bg-white mx-4 mb-4 rounded-3xl border border-gray-100 p-5 shadow-sm">
      {/* Title bars */}
      <View className="h-5 bg-gray-200 rounded-md mb-2 w-3/4" />
      <View className="h-5 bg-gray-200 rounded-md mb-4 w-1/2" />

      {/* Pill row */}
      <View className="flex-row mb-4 gap-2">
        <View className="h-6 w-20 bg-gray-200 rounded-full" />
        <View className="h-6 w-16 bg-gray-200 rounded-full" />
        <View className="h-6 w-24 bg-gray-200 rounded-full" />
      </View>

      {/* Actions row */}
      <View className="flex-row justify-end border-t border-gray-50 pt-3 mt-1 gap-6">
        <View className="w-6 h-6 rounded-full bg-gray-200" />
        <View className="w-6 h-6 rounded-full bg-gray-200" />
      </View>
    </View>
  );
};