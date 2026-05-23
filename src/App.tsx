import React, { Component, type ReactNode, useCallback, useRef, useState } from 'react';
import { Animated, Easing, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { FeedScreen } from './screens/FeedScreen'
import { SavedReelsScreen } from './screens/SavedReelsScreen';

const queryClient = new QueryClient();
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

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'feed' | 'saved'>('feed');
  const [transitionTarget, setTransitionTarget] = useState<'feed' | 'saved' | null>(null);
  const slide = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = useWindowDimensions();

  const animateToScreen = useCallback((nextScreen: 'feed' | 'saved') => {
    if (nextScreen === activeScreen || transitionTarget) {
      return;
    }

    setTransitionTarget(nextScreen);
    slide.setValue(activeScreen === 'feed' ? 0 : 1);

    Animated.timing(slide, {
      toValue: nextScreen === 'saved' ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setActiveScreen(nextScreen);
      }
      setTransitionTarget(null);
    });
  }, [activeScreen, slide, transitionTarget]);

  const feedTranslateX = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -screenWidth],
  });

  const savedTranslateX = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth, 0],
  });

  const isAnimating = transitionTarget !== null;

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaView className="flex-1 bg-gray-50" style={styles.safeArea}>
            <View style={styles.screenStack}>
              <Animated.View
                style={[
                  styles.screenLayer,
                  { transform: [{ translateX: feedTranslateX }] },
                ]}
                pointerEvents={activeScreen === 'feed' && !isAnimating ? 'auto' : 'none'}
              >
                <FeedScreen onOpenSaved={() => animateToScreen('saved')} />
              </Animated.View>

              <Animated.View
                style={[
                  styles.screenLayer,
                  { transform: [{ translateX: savedTranslateX }] },
                ]}
                pointerEvents={activeScreen === 'saved' && !isAnimating ? 'auto' : 'none'}
              >
                <SavedReelsScreen onBackToFeed={() => animateToScreen('feed')} />
              </Animated.View>
            </View>
          </SafeAreaView>
          <Toast />
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenStack: {
    flex: 1,
    overflow: 'hidden',
  },
  screenLayer: {
    ...StyleSheet.absoluteFill,
  },
});