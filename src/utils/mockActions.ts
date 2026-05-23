// 1. Export this new ActionType
export type ActionType = 'like' | 'unlike' | 'save' | 'unsave';

// 2. Update the action parameter to use the new type
export const mockToggleAction = async (storyId: string, action: ActionType): Promise<{ success: boolean, id: string }> => {
  const delay = Math.floor(Math.random() * (800 - 300 + 1)) + 300;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 15% chance to fail 
      const isFailure = Math.random() < 0.15;

      if (isFailure) {
        // Now this will seamlessly inject 'unlike' or 'unsave'
        reject(new Error(`Failed to ${action} story. Please try again.`));
      } else {
        resolve({ success: true, id: storyId });
      }
    }, delay);
  });
};