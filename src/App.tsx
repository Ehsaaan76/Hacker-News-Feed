// src/App.tsx
import React, { useState, Component, type ReactNode } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import Toast from 'react-native-toast-message';
import { X, Rss } from 'lucide-react-native';

import { useHackerNews } from './hooks/useHackerNews';
import { StoryCard } from './components/StoryCard';
import { SkeletonCard } from './components/SkeletonCard';
import { Story } from './types';

const queryClient = new QueryClient();

// ─── Error Boundary ──────────────────────────────────────────────────────────
interface EBState { hasError: boolean; error: string }
class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false, error: '' };
  static getDerivedStateFromError(err: Error): EBState {
    return { hasError: true, error: err.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-gray-50 px-8">
          <Text className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</Text>
          <Text className="text-sm text-gray-500 text-center">{this.state.error}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// ─── Ask HN Modal ─────────────────────────────────────────────────────────────
const StoryModal = ({ story, onClose }: { story: Story | null; onClose: () => void }) => (
  <Modal
    visible={!!story}
    animationType="slide"
    presentationStyle="pageSheet"
    onRequestClose={onClose}
  >
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="flex-1 text-base font-bold text-gray-900 mr-3" numberOfLines={1}>
          {story?.title}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="p-2 bg-gray-100 rounded-full"
        >
          <X size={18} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
        <Text className="text-base leading-7 text-gray-700">
          {story?.story_text?.replace(/<[^>]+>/g, '') ?? ''}
        </Text>
      </ScrollView>
    </SafeAreaView>
  </Modal>
);

// ─── Feed Screen ──────────────────────────────────────────────────────────────
const FeedScreen = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useHackerNews();

  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const stories = data?.pages.flatMap((page) => page.hits) ?? [];

  const handleStoryPress = (story: Story) => {
    if (story.url) {
      Linking.openURL(story.url).catch(() =>
        Toast.show({ type: 'error', text1: 'Error', text2: 'Could not open article link.' }),
      );
    } else if (story.story_text) {
      setSelectedStory(story);
    }
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 pt-24">
        {[1, 2, 3, 4, 5].map((k) => (
          <SkeletonCard key={k} />
        ))}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Floating header */}
      <View
        className="absolute top-10 left-4 right-4 z-10 flex-row items-center justify-between bg-white/95 rounded-2xl px-6 py-4"
        style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12 }}
      >
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 bg-orange-500 rounded-xl items-center justify-center">
            <Rss size={16} color="#fff" />
          </View>
          <Text className="text-xl font-extrabold text-gray-900 tracking-tight">
            Hacker Feed
          </Text>
        </View>
        <View className="bg-orange-50 rounded-full px-3 py-1">
          <Text className="text-xs font-semibold text-orange-600">{stories.length} stories</Text>
        </View>
      </View>

      {/* Story list */}
      <FlashList<Story>
        data={stories}
        renderItem={({ item }) => (
          <StoryCard story={item} onPress={() => handleStoryPress(item)} />
        )}
        keyExtractor={(item) => item.objectID}
        estimatedItemSize={160}
        contentContainerStyle={{ paddingTop: 112, paddingBottom: 40 }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-6 items-center">
              <ActivityIndicator size="small" color="#f97316" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-24">
            <Text className="text-gray-400 text-base">No stories yet</Text>
          </View>
        }
      />

      <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />
    </View>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaView className="flex-1 bg-gray-50">
            <FeedScreen />
          </SafeAreaView>
          <Toast />
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}