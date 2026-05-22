import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchStories } from '../api/hackerNews';

export const useHackerNews = () => {
  return useInfiniteQuery({
    queryKey: ['hacker-news-feed'],
    queryFn: ({ pageParam = 0 }) => fetchStories(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.nbPages - 1) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};