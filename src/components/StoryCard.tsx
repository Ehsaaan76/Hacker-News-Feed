// src/components/StoryCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Heart, Bookmark } from 'lucide-react-native';
import { Story } from '../types';
import { useStoryStore } from '../store/useStoryStore';
import { useStoryActions } from '../hooks/useStoryActions';

interface Props {
  story: Story;
  onPress: () => void;
}

export const StoryCard = ({ story, onPress }: Props) => {
  const { savedStoryIds, likedStoryIds } = useStoryStore();
  const { handleOptimisticAction } = useStoryActions();

  const isSaved = !!savedStoryIds[story.objectID];
  const isLiked = !!likedStoryIds[story.objectID];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="bg-white mx-4 mb-4 rounded-3xl border border-gray-100 p-5"
      style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }}
    >
      {/* Title */}
      <Text className="text-lg font-bold text-gray-900 mb-3 leading-6">
        {story.title}
      </Text>

      {/* Meta pills */}
      <View className="flex-row flex-wrap mb-4 gap-2">
        <View className="bg-orange-50 rounded-full px-3 py-1">
          <Text className="text-xs font-semibold text-orange-600">@{story.author}</Text>
        </View>
        <View className="bg-gray-100 rounded-full px-3 py-1">
          <Text className="text-xs font-medium text-gray-500">{story.points} pts</Text>
        </View>
        <View className="bg-gray-100 rounded-full px-3 py-1">
          <Text className="text-xs font-medium text-gray-500">{story.num_comments} comments</Text>
        </View>
        {!story.url && (
          <View className="bg-blue-50 rounded-full px-3 py-1">
            <Text className="text-xs font-medium text-blue-500">Ask HN</Text>
          </View>
        )}
      </View>

      {/* Actions row */}
      <View className="flex-row justify-end border-t border-gray-50 pt-3 mt-1 gap-6">
        <TouchableOpacity
          onPress={() => handleOptimisticAction(story.objectID, 'like')}
          className="p-1"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Heart
            size={22}
            color={isLiked ? '#ef4444' : '#9ca3af'}
            fill={isLiked ? '#ef4444' : 'transparent'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOptimisticAction(story.objectID, 'save')}
          className="p-1"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Bookmark
            size={22}
            color={isSaved ? '#3b82f6' : '#9ca3af'}
            fill={isSaved ? '#3b82f6' : 'transparent'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};