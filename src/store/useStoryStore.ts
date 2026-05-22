// src/store/useStoryStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

type PersistedStoryState = Pick<StoryState, 'savedStoryIds' | 'likedStoryIds'>;

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
  likedStoryIds: Record<string, boolean>;
  toggleSave: (id: string) => void;
  toggleLike: (id: string) => void;
  // We include revert functions to handle the 15% failure rate rollback requirement
  revertSave: (id: string) => void;
  revertLike: (id: string) => void;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set) => ({
      savedStoryIds: {},
      likedStoryIds: {},

      toggleSave: (id) =>
        set((state) => ({
          savedStoryIds: {
            ...state.savedStoryIds,
            [id]: !state.savedStoryIds[id],
          },
        })),

      toggleLike: (id) =>
        set((state) => ({
          likedStoryIds: {
            ...state.likedStoryIds,
            [id]: !state.likedStoryIds[id],
          },
        })),

      revertSave: (id) =>
        set((state) => ({
          savedStoryIds: {
            ...state.savedStoryIds,
            [id]: !state.savedStoryIds[id],
          },
        })),

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
        likedStoryIds: state.likedStoryIds,
      }),
    }
  )
);