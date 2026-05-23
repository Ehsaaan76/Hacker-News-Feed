import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Heart, Bookmark } from 'lucide-react-native';
import { Story } from '../types';
import { useStoryStore } from '../store/useStoryStore';
import { useStoryActions } from '../hooks/useStoryActions';

interface Props {
  story: Story;
  onPress: () => void;
}

const StoryCardComponent = ({ story, onPress }: Props) => {
  const { savedStoryIds, likedStoryIds } = useStoryStore();
  const { handleOptimisticAction } = useStoryActions();

  const isSaved = !!savedStoryIds[story.objectID];
  const isLiked = !!likedStoryIds[story.objectID];

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress} 
      className="bg-white p-5 mb-4 mx-4 rounded-3xl border border-gray-100"
      style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
    >
      <Text className="text-lg font-bold text-gray-900 mb-3 leading-snug">{story.title}</Text>
      
      <View className="flex-row items-center mb-4 space-x-2">
        <View className="bg-gray-100 rounded-full px-3 py-1">
          <Text className="text-xs font-medium text-gray-600">@{story.author}</Text>
        </View>
        <View className="bg-gray-100 rounded-full px-3 py-1">
          <Text className="text-xs font-medium text-gray-600">{story.points} pts</Text>
        </View>
      </View>

      <View className="flex-row justify-end space-x-6 border-t border-gray-50 pt-3 mt-1">
        <TouchableOpacity onPress={() => handleOptimisticAction(story.objectID, 'like')} className="p-1">
          <Heart size={22} color={isLiked ? '#ef4444' : '#9ca3af'} fill={isLiked ? '#ef4444' : 'transparent'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleOptimisticAction(story.objectID, 'save')} className="p-1">
          <Bookmark size={22} color={isSaved ? '#3b82f6' : '#9ca3af'} fill={isSaved ? '#3b82f6' : 'transparent'} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// React.memo prevents re-renders unless the props change, saving massive CPU cycles during scroll
export const StoryCard = memo(StoryCardComponent, (prevProps, nextProps) => {
  return prevProps.story.objectID === nextProps.story.objectID;
});