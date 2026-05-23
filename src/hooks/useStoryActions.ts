import Toast from 'react-native-toast-message';
import { useStoryStore } from '../store/useStoryStore';
import { mockToggleAction, ActionType } from '../utils/mockActions';
import type { Story } from '../types';

export const useStoryActions = () => {
  // 1. Bring in the lists of currently liked/saved IDs so we can check them
  const { toggleLike, toggleSave, revertLike, revertSave, likedStoryIds, savedStoryIds } = useStoryStore();

  const handleOptimisticAction = async (story: Story, action: 'like' | 'save') => {
    const storyId = story.objectID;
    
    // 2. Figure out the true intent BEFORE we toggle the state
    const isCurrentlyActive = action === 'like' ? !!likedStoryIds[storyId] : !!savedStoryIds[storyId];
    
    // Create the correct verb ('unlike' or 'unsave' if it's already active)
    const apiVerb: ActionType = isCurrentlyActive ? `un${action}` : action;

    // 3. Optimistic Update (UI updates instantly)
    if (action === 'like') toggleLike(storyId);
    if (action === 'save') toggleSave(story);

    try {
      // 4. Pass the specific verb to the mock API
      await mockToggleAction(storyId, apiVerb);
    } catch (error: any) {
      // 5. Rollback on Failure 
      if (action === 'like') revertLike(storyId);
      if (action === 'save') revertSave(story);
      
      Toast.show({
        type: 'error',
        text1: 'Action Failed',
        text2: error.message, // This will now accurately say "Failed to unlike story."
        position: 'top',
        topOffset: 60,
      });
    }
  };

  return { handleOptimisticAction };
};