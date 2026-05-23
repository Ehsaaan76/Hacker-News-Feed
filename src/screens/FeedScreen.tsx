import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ActivityIndicator, StatusBar, Linking } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Toast from 'react-native-toast-message';
import { Rss } from 'lucide-react-native';

import { useHackerNews } from '../hooks/useHackerNews';
import { StoryCard } from '../components/StoryCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { StoryModal } from '../components/StoryModal';
import { Story } from '../types';

export const FeedScreen = () => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } = useHackerNews();
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);

    // FIX: useMemo prevents the array from being flattened on every single scroll frame
    const stories = useMemo(() => {
        return data?.pages.flatMap((page) => page.hits) ?? [];
    }, [data]);

    // FIX: useCallback prevents function recreation on every render
    const handleStoryPress = useCallback((story: Story) => {
        if (story.url) {
            Linking.openURL(story.url).catch(() =>
                Toast.show({ type: 'error', text1: 'Error', text2: 'Could not open article.' }),
            );
        } else if (story.story_text) {
            setSelectedStory(story);
        }
    }, []);

    // FIX: Memoize the renderItem function
    const renderItem = useCallback(({ item }: { item: Story }) => (
        <StoryCard story={item} onPress={() => handleStoryPress(item)} />
    ), [handleStoryPress]);

    // Limit skeletons to 4 so it doesn't overflow the screen and feel overwhelming
    if (isLoading) {
        return (
            <View className="flex-1 bg-gray-50 pt-24" style={{ flex: 1, paddingTop: 96 }}>
                {[1, 2, 3, 4].map((k) => <SkeletonCard key={k} />)}
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50" style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            <View
                className="absolute top-10 left-4 right-4 z-10 flex-row items-center justify-between bg-white/95 rounded-2xl px-6 py-4"
                style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12 }}
            >
                <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 bg-orange-500 rounded-xl items-center justify-center">
                        <Rss size={16} color="#fff" />
                    </View>
                    <Text className="text-xl font-extrabold text-gray-900 tracking-tight">Hacker Feed</Text>
                </View>
                <View className="bg-orange-50 rounded-full px-3 py-1">
                    <Text className="text-xs font-semibold text-orange-600">{stories.length} stories</Text>
                </View>
            </View>

            <FlashList<Story>
                data={stories}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.objectID}-${index}`} // Safest key extraction

                // FIX 1: Overestimate this to prevent the "blank space on scroll" bug
                // @ts-ignore
                estimatedItemSize={250}

                contentContainerStyle={{ paddingTop: 112, paddingBottom: 100 }} // Added extra bottom padding

                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                // FIX 2: Trigger the fetch earlier so the loader has time to appear
                onEndReachedThreshold={0.8}

                onRefresh={async () => {
                    await refetch();
                    Toast.show({
                        type: 'success',
                        text1: 'Feed Refreshed',
                        text2: 'Fetched latest stories from Hacker News.',
                        position: 'bottom',
                    });
                }}
                refreshing={isRefetching}

                // FIX 3: Give the footer a dedicated height so it doesn't get squished
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className="py-8 items-center justify-center h-24">
                            <ActivityIndicator size="large" color="#f97316" />
                            <Text className="text-gray-400 text-xs mt-2 font-medium">Loading more stories...</Text>
                        </View>
                    ) : null
                }
            />

            <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />
        </View>
    );
};