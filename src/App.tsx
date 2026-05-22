import React, { useState } from 'react';
// 1. IMPORT SafeAreaProvider HERE
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, StatusBar, Modal, TouchableOpacity, ScrollView, Linking, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import Toast from 'react-native-toast-message';
import { X } from 'lucide-react-native';

import { useHackerNews } from './hooks/useHackerNews';
import { StoryCard } from './components/StoryCard';
import { SkeletonCard } from './components/SkeletonCard';
import { Story } from './types';

const queryClient = new QueryClient();

const FeedScreen = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } = useHackerNews();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const stories = data?.pages.flatMap((page) => page.hits) || [];

  const handleStoryPress = (story: Story) => {
    if (story.url) {
      Linking.openURL(story.url).catch(() => Toast.show({ type: 'error', text1: 'Error', text2: 'Could not open article link.' }));
    } else if (story.story_text) {
      setSelectedStory(story);
    }
  };

  if (isLoading) {
    return (
      // 2. Added style={{ flex: 1 }} as a safety net
      <View className="flex-1 bg-gray-50 pt-24" style={{ flex: 1, paddingTop: 96 }}>
        {[1, 2, 3, 4, 5].map((key) => <SkeletonCard key={key} />)}
      </View>
    );
  }

  return (
    // 2. Added style={{ flex: 1 }} here as well
    <View className="flex-1 bg-gray-50" style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      
      {/* Floating Header */}
      <View className="absolute top-12 left-4 right-4 z-10 bg-white/95 rounded-2xl py-4 px-6 flex-row justify-between items-center" style={styles.header}>
        <Text className="text-xl font-extrabold text-gray-900">Hacker Feed</Text>
      </View>

      {/* FlashList requires its parent to have flex: 1 */}
      <FlashList<Story>
        data={stories}
        renderItem={({ item }) => (
          <View>
             <StoryCard story={item} onPress={() => handleStoryPress(item)} />
          </View>
        )}
        keyExtractor={(item) => item.objectID}
        // @ts-ignore
        estimatedItemSize={180}
        contentContainerStyle={styles.listContent}
        
        onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
        refreshing={isRefetching}
        
        ListFooterComponent={isFetchingNextPage ? <View className="py-6"><ActivityIndicator size="small" color="#3b82f6" /></View> : null}
      />

      <Modal visible={!!selectedStory} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectedStory(null)}>
        <SafeAreaView className="flex-1 bg-white" style={{ flex: 1 }}>
          <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
            <Text className="text-lg font-bold flex-1" numberOfLines={1}>{selectedStory?.title}</Text>
            <TouchableOpacity onPress={() => setSelectedStory(null)} className="p-2 bg-gray-100 rounded-full ml-2">
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView className="p-5">
            <Text className="text-base text-gray-700 leading-relaxed pb-10">
              {selectedStory?.story_text?.replace(/<[^>]+>/g, '')}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default function App() {
  return (
    // 3. Wrapped the whole app in SafeAreaProvider
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView className="flex-1 bg-gray-50" style={{ flex: 1 }}>
          <FeedScreen />
        </SafeAreaView>
        <Toast /> 
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    elevation: 4,
    // Add these just in case NativeWind isn't processing the header correctly yet
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingTop: 120,
    paddingBottom: 40,
  },
});