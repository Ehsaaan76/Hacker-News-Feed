import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StatusBar, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import Toast from 'react-native-toast-message';
import { ArrowLeft, Bookmark } from 'lucide-react-native';

import { StoryCard } from '../components/StoryCard';
import { StoryModal } from '../components/StoryModal';
import { useStoryStore } from '../store/useStoryStore';
import { Story } from '../types';

const HEADER_HEIGHT = 85;

interface SavedReelsScreenProps {
  onBackToFeed: () => void;
}

export const SavedReelsScreen = ({ onBackToFeed }: SavedReelsScreenProps) => {
  const { savedStoriesById } = useStoryStore();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const listRef = useRef<FlashListRef<Story> | null>(null);

  const savedStories = useMemo(() => Object.values(savedStoriesById), [savedStoriesById]);

  const handleStoryPress = useCallback((story: Story) => {
    if (story.url) {
      Linking.openURL(story.url).catch(() =>
        Toast.show({ type: 'error', text1: 'Error', text2: 'Could not open article.' }),
      );
    } else if (story.story_text) {
      setSelectedStory(story);
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: Story }) => (
    <StoryCard story={item} onPress={() => handleStoryPress(item)} />
  ), [handleStoryPress]);

  return (
    <View className="flex-1 bg-gray-50" style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <View
        className="absolute left-4 right-4 z-10 flex-row items-center justify-between bg-white/95 rounded-2xl px-6 py-4"
        style={styles.headerCard}
      >
        <TouchableOpacity onPress={onBackToFeed} activeOpacity={0.7} className="flex-row items-center gap-2">
          <View className="w-8 h-8 bg-orange-500 rounded-xl items-center justify-center">
            <ArrowLeft size={16} color="#fff" />
          </View>
          <Text className="text-xl font-extrabold text-gray-900 tracking-tight">Saved Reels</Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-2 bg-orange-50 rounded-full px-3 py-1">
          <Bookmark size={14} color="#f97316" />
          <Text className="text-xs font-semibold text-orange-600">{savedStories.length} saved</Text>
        </View>
      </View>

      <FlashList<Story>
        ref={listRef}
        data={savedStories}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.objectID}-${index}`}
        // @ts-ignore
        estimatedItemSize={250}
        drawDistance={1000}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<View style={styles.listHeaderSpacer} />}
        ListEmptyComponent={(
          <View className="flex-1 items-center justify-center px-8 pt-24">
            <View className="w-16 h-16 rounded-2xl bg-orange-100 items-center justify-center mb-4">
              <Bookmark size={24} color="#f97316" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">Nothing saved yet</Text>
            <Text className="text-sm text-gray-500 text-center leading-6 mb-6">
              Tap the bookmark on any story to save it here and revisit it later.
            </Text>
            <TouchableOpacity onPress={onBackToFeed} activeOpacity={0.8} className="bg-orange-500 px-5 py-3 rounded-2xl">
              <Text className="text-white font-semibold">Back to feed</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerCard: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
  listHeaderSpacer: {
    height: HEADER_HEIGHT,
  },
});