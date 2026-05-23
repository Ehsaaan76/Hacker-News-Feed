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

    const listRef = useRef<FlashListRef<Story> | null>(null);

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

    const scrollToTop = () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    return (
        <View className="flex-1 bg-gray-50" style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            {/* 1. FLOATING HEADER RETURNED: Set to absolute so posts slide behind it */}
            <View
                className="absolute left-4 right-4 z-10 flex-row items-center justify-between bg-white/95 rounded-2xl px-6 py-4"
                style={styles.headerCard}
            >
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

            {/* 2. LOADING STATE ALIGNMENT */}
            {isLoading ? (
                <View className="flex-1" style={{ paddingTop: 85 }}>
                    {[1, 2, 3, 4].map((k) => <SkeletonCard key={k} />)}
                </View>
            ) : (
                <FlashList<Story>
                    ref={listRef}
                    data={stories}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.objectID}-${index}`}
                    // @ts-ignore
                    estimatedItemSize={250}
                    drawDistance={1000}
                    
                    // 3. NO MORE PADDING TOP: This fixes the momentum scroll bug!
                    contentContainerStyle={{ paddingBottom: 100 }}

                    // 4. THE MAGIC SPACER: Pushes the first post down below the floating header
                    ListHeaderComponent={<View style={{ height: 85 }} />}

                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) {
                            fetchNextPage();
                        }
                    }}
                    onEndReachedThreshold={1}

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
                            // 5. Offset the spinner so it pops out precisely below the floating header
                            progressViewOffset={96} 
                            colors={['#f97316']}
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
            )}

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
});