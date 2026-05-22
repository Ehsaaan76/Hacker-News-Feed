// src/hooks/useStoryActions.ts
import Toast from 'react-native-toast-message';
import { useStoryStore } from '../store/useStoryStore';
import { mockToggleAction } from '../api/mockActions';

export const useStoryActions = () => {
  const { toggleLike, toggleSave, revertLike, revertSave } = useStoryStore();

  const handleOptimisticAction = async (id: string, action: 'like' | 'save') => {
    // 1. Optimistic Update
    if (action === 'like') toggleLike(id);
    if (action === 'save') toggleSave(id);

    try {
      // 2. Mock API Request (300-800ms delay) [cite: 24, 25]
      await mockToggleAction(id, action);
    } catch (error: any) {
      // 3. Rollback on Failure 
      if (action === 'like') revertLike(id);
      if (action === 'save') revertSave(id);
      
      // Modern non-blocking notification
      Toast.show({
        type: 'error',
        text1: 'Action Failed',
        text2: error.message || `Could not ${action} the story. UI rolled back.`,
        position: 'top',
        topOffset: 60,
      });
    }
  };

  return { handleOptimisticAction };
};