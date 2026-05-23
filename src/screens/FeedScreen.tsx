import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StatusBar, Linking, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import Toast from 'react-native-toast-message';
import { Bookmark, Rss } from 'lucide-react-native';

import { useHackerNews } from '../hooks/useHackerNews';
import { StoryCard } from '../components/StoryCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { StoryModal } from '../components/StoryModal';
import { useStoryStore } from '../store/useStoryStore';
import { Story } from '../types';

const HEADER_HEIGHT = 85;
const CONTENT_BOTTOM_PADDING = 100;

interface FeedScreenProps {
    onOpenSaved: () => void;
}

export const FeedScreen = ({ onOpenSaved }: FeedScreenProps) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } = useHackerNews();
    const syncSavedStories = useStoryStore((state) => state.syncSavedStories);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);

    const listRef = useRef<FlashListRef<Story> | null>(null);

    const stories = useMemo(() => {
        return data?.pages.flatMap((page) => page.hits) ?? [];
    }, [data]);

    useEffect(() => {
        if (stories.length > 0) {
            syncSavedStories(stories);
        }
    }, [stories, syncSavedStories]);

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

    const handleRefresh = useCallback(async () => {
        if (isRefetching) {
            return;
        }

        await refetch();

        Toast.show({
            type: 'success',
            text1: 'Feed Refreshed',
            text2: 'Fetched latest stories from Hacker News.',
            position: 'bottom',
        });
    }, [isRefetching, refetch]);

    const headerPullResponder = useMemo(() => PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return gestureState.dy > 10 && Math.abs(gestureState.dx) < 12 && !isRefetching;
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy > 70) {
                handleRefresh();
                return undefined;
            }

            return undefined;
        },
    }), [handleRefresh, isRefetching]);

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
                {...headerPullResponder.panHandlers}
            >
                <TouchableOpacity onPress={scrollToTop} activeOpacity={0.7} className="flex-row items-center gap-2">
                    <View className="w-8 h-8 bg-orange-500 rounded-xl items-center justify-center">
                        <Rss size={16} color="#fff" />
                    </View>
                    <Text className="text-xl font-extrabold text-gray-900 tracking-tight">Hacker Feed</Text>
                </TouchableOpacity>

                <View className="flex-row items-center gap-2">
                    <TouchableOpacity onPress={onOpenSaved} activeOpacity={0.7} className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                        <Bookmark size={18} color="#374151" />
                    </TouchableOpacity>
                    <View className="flex-row items-center gap-2 bg-orange-50 rounded-full px-3 py-1">
                        <Text className="text-xs font-semibold text-orange-600">{stories.length} stories</Text>
                    </View>
                </View>
            </View>

            {/* 2. LOADING STATE ALIGNMENT */}
            {isLoading ? (
                <View className="flex-1" style={styles.loadingTopSpacing}>
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
                    contentContainerStyle={styles.listContent}

                    // 4. THE MAGIC SPACER: Pushes the first post down below the floating header
                    ListHeaderComponent={<View style={styles.listHeaderSpacer} />}

                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) {
                            fetchNextPage();
                        }
                    }}
                    onEndReachedThreshold={1}

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
    loadingTopSpacing: {
        paddingTop: HEADER_HEIGHT,
    },
    listContent: {
        paddingBottom: CONTENT_BOTTOM_PADDING,
    },
    listHeaderSpacer: {
        height: HEADER_HEIGHT,
    },
    headerCard: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
});