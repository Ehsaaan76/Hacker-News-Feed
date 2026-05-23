import { AlgoliaResponse } from '../types';

const BASE_URL = 'https://hn.algolia.com/api/v1';

const fallbackStories: AlgoliaResponse = {
  hits: [
    {
      objectID: 'fallback-1',
      title: 'Welcome to Hacker News Feed',
      url: 'https://news.ycombinator.com/',
      author: 'copilot',
      points: 0,
      num_comments: 0,
      created_at: new Date().toISOString(),
      story_text: null,
    },
    {
      objectID: 'fallback-2',
      title: 'Unable to reach the live feed right now',
      url: null,
      author: 'copilot',
      points: 0,
      num_comments: 0,
      created_at: new Date().toISOString(),
      story_text: 'The app is using a local fallback so the UI stays usable even when the network request fails.',
    },
    {
      objectID: 'fallback-3',
      title: 'Tap the heart or bookmark to test actions',
      url: null,
      author: 'copilot',
      points: 0,
      num_comments: 0,
      created_at: new Date().toISOString(),
      story_text: 'Optimistic updates and rollback still work on the fallback feed.',
    },
  ],
  page: 0,
  nbPages: 50,
};

export const fetchStories = async (pageParam: number = 0): Promise<AlgoliaResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/search_by_date?tags=story&page=${pageParam}&hitsPerPage=20`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch {
    return fallbackStories;
  }
};