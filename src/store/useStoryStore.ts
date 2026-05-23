// src/store/useStoryStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import type { Story } from '../types';

type PersistedStoryState = Pick<StoryState, 'savedStoryIds' | 'savedStoriesById' | 'likedStoryIds'>;

const memoryStorage = new Map<string, string>();

const safeStorage: StateStorage = (() => {
  try {
    const mmkv = createMMKV({ id: 'story-storage' });

    return {
      setItem: (name, value) => {
        mmkv.set(name, value);
      },
      getItem: (name) => {
        return mmkv.getString(name) ?? null;
      },
      removeItem: (name) => {
        mmkv.remove(name);
      },
    };
  } catch {
    return {
      setItem: (name, value) => {
        memoryStorage.set(name, value);
      },
      getItem: (name) => {
        return memoryStorage.get(name) ?? null;
      },
      removeItem: (name) => {
        memoryStorage.delete(name);
      },
    };
  }
})();

interface StoryState {
  savedStoryIds: Record<string, boolean>;
  savedStoriesById: Record<string, Story>;
  likedStoryIds: Record<string, boolean>;
  toggleSave: (story: Story) => void;
  toggleLike: (id: string) => void;
  syncSavedStories: (stories: Story[]) => void;
  // We include revert functions to handle the 15% failure rate rollback requirement
  revertSave: (story: Story) => void;
  revertLike: (id: string) => void;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set) => ({
      savedStoryIds: {},
      savedStoriesById: {},
      likedStoryIds: {},

      toggleSave: (story) =>
        set((state) => {
          const isSaved = !!state.savedStoryIds[story.objectID];
          const savedStoryIds = {
            ...state.savedStoryIds,
            [story.objectID]: !isSaved,
          };
          const savedStoriesById = { ...state.savedStoriesById };

          if (isSaved) {
            delete savedStoriesById[story.objectID];
          } else {
            savedStoriesById[story.objectID] = story;
          }

          return { savedStoryIds, savedStoriesById };
        }),

      toggleLike: (id) =>
        set((state) => ({
          likedStoryIds: {
            ...state.likedStoryIds,
            [id]: !state.likedStoryIds[id],
          },
        })),

      syncSavedStories: (stories) =>
        set((state) => {
          const savedStoriesById = { ...state.savedStoriesById };

          for (const story of stories) {
            if (state.savedStoryIds[story.objectID]) {
              savedStoriesById[story.objectID] = story;
            }
          }

          return { savedStoriesById };
        }),

      revertSave: (story) =>
        set((state) => {
          const isSaved = !!state.savedStoryIds[story.objectID];
          const savedStoryIds = {
            ...state.savedStoryIds,
            [story.objectID]: !isSaved,
          };
          const savedStoriesById = { ...state.savedStoriesById };

          if (isSaved) {
            delete savedStoriesById[story.objectID];
          } else {
            savedStoriesById[story.objectID] = story;
          }

          return { savedStoryIds, savedStoriesById };
        }),

      revertLike: (id) =>
        set((state) => ({
          likedStoryIds: {
            ...state.likedStoryIds,
            [id]: !state.likedStoryIds[id],
          },
        })),
    }),
    {
      name: 'story-storage',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state): PersistedStoryState => ({
        savedStoryIds: state.savedStoryIds,
        savedStoriesById: state.savedStoriesById,
        likedStoryIds: state.likedStoryIds,
      }),
    }
  )
);