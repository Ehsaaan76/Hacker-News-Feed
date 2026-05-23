import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, ActivityIndicator, StatusBar, Linking, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
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

    // 1. Create a ref to control the list
    const listRef = useRef<FlashListRef<any> | null>(null);

    const stories = useMemo(() => {
        return data?.pages.flatMap((page) => page.hits) ?? [];
    }, [data]);

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

    // 2. Scroll to top function
    const scrollToTop = () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-gray-50" style={styles.loadingScreen}>
                {[1, 2, 3, 4].map((k) => <SkeletonCard key={k} />)}
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50" style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            <View
                className="absolute top-10 left-4 right-4 z-10 flex-row items-center justify-between bg-white/95 rounded-2xl px-6 py-4"
                style={styles.headerCard}
            >
                {/* 3. Make the header clickable to scroll to top */}
                <TouchableOpacity onPress={scrollToTop} activeOpacity={0.7} className="flex-row items-center gap-2">
                    <View className="w-8 h-8 bg-orange-500 rounded-xl items-center justify-center">
                        <Rss size={16} color="#fff" />
                    </View>
                    <Text className="text-xl font-extrabold text-gray-900 tracking-tight">Hacker Feed</Text>
                </TouchableOpacity>

                <View className="bg-orange-50 rounded-full px-3 py-1">
                    <Text className="text-xs font-semibold text-orange-600">{stories.length} stories</Text>
                </View>
            </View>

            <FlashList<Story>
                ref={listRef} // Attach the ref here
                data={stories}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.objectID}-${index}`}
                // @ts-ignore
                estimatedItemSize={214}
                drawDistance={1000}
                contentContainerStyle={styles.listContent}

                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={1}

                // 4. Use RefreshControl to push the spinner below the header
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={async () => {
                            await refetch();
                            Toast.show({
                                type: 'success',
                                text1: 'Feed Refreshed',
                                text2: 'Fetched latest stories from Hacker News.',
                                position: 'bottom',
                            });
                        }}
                        progressViewOffset={110} // This pushes it down!
                        colors={['#f97316']} // Matches your orange theme
                        tintColor="#f97316"
                    />
                }

                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View>
                            <SkeletonCard />
                            <SkeletonCard />
                            <View className="py-4 items-center justify-center">
                                <ActivityIndicator size="small" color="#f97316" />
                                <Text className="text-gray-400 text-xs mt-2 font-medium">Loading more stories...</Text>
                            </View>
                        </View>
                    ) : null
                }
            />

            <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    loadingScreen: {
        flex: 1,
        paddingTop: 96,
    },
    headerCard: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
    listContent: {
        paddingTop: 112,
        paddingBottom: 100,
    },
});