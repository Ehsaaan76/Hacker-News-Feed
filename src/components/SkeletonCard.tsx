// src/components/SkeletonCard.tsx
import React from 'react';
import { View } from 'react-native';

export const SkeletonCard = () => {
  return (
    <View className="bg-white p-5 mb-4 mx-4 rounded-3xl border border-gray-100"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
      
      {/* Title Skeleton */}
      <View className="h-5 bg-gray-200 rounded-md w-3/4 mb-2 animate-pulse" />
      <View className="h-5 bg-gray-200 rounded-md w-1/2 mb-4 animate-pulse" />
      
      {/* Pill Row Skeleton */}
      <View className="flex-row mb-4 space-x-2">
        <View className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
        <View className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        <View className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
      </View>

      {/* Action Buttons Skeleton */}
      <View className="flex-row justify-end space-x-6 border-t border-gray-50 pt-3 mt-1">
        <View className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
        <View className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
      </View>
    </View>
  );
};