export const mockToggleAction = async (storyId: string, action: 'like' | 'save'): Promise<{ success: boolean, id: string }> => {
  const delay = Math.floor(Math.random() * (800 - 300 + 1)) + 300;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 15% chance to fail 
      const isFailure = Math.random() < 0.15;

      if (isFailure) {
        reject(new Error(`Failed to ${action} story ${storyId}. Please try again.`));
      } else {
        resolve({ success: true, id: storyId });
      }
    }, delay);
  });
};